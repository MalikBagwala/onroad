## Onroad Application

1. `make https` (install mkcert if you haven't already https://github.com/FiloSottile/mkcert)
2. `docker compose -f development.yml up` Will run the complete stack locally, you can make changes to the api server and client app and it will reflect without restarting
3. `docker compose up` Will run the complete stack locally in production setting


## DB Triggers

Update upvotes and downvotes

```sql
-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS contribution_vote_trigger ON votes;

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_contribution_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE contributions
        SET upvotes = upvotes + CASE WHEN NEW.type = 'UP' THEN 1 ELSE 0 END,
            downvotes = downvotes + CASE WHEN NEW.type = 'DN' THEN 1 ELSE 0 END
        WHERE id = NEW.contribution_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE contributions
        SET upvotes = upvotes + CASE WHEN NEW.type = 'UP' THEN 1 ELSE 0 END - CASE WHEN OLD.type = 'UP' THEN 1 ELSE 0 END,
            downvotes = downvotes + CASE WHEN NEW.type = 'DN' THEN 1 ELSE 0 END - CASE WHEN OLD.type = 'DN' THEN 1 ELSE 0 END
        WHERE id = NEW.contribution_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE contributions
        SET upvotes = upvotes - CASE WHEN OLD.type = 'UP' THEN 1 ELSE 0 END,
            downvotes = downvotes - CASE WHEN OLD.type = 'DN' THEN 1 ELSE 0 END
        WHERE id = OLD.contribution_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER contribution_vote_trigger
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_contribution_votes();
```

Update contribution total price

```sql
-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS contribution_price_item_trigger ON contribution_price_items;

CREATE OR REPLACE FUNCTION update_contribution_total()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE contributions
        SET total = COALESCE(
            (SELECT SUM(CASE WHEN p.type = 'DB' THEN cpi.value ELSE -cpi.value END)
             FROM contribution_price_items cpi
             JOIN price_items p ON cpi.price_item_id = p.id
             WHERE cpi.contribution_id = NEW.contribution_id),
            0
        )
        WHERE id = NEW.contribution_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE contributions
        SET total = COALESCE(
            (SELECT SUM(CASE WHEN p.type = 'DB' THEN cpi.value ELSE -cpi.value END)
             FROM contribution_price_items cpi
             JOIN price_items p ON cpi.price_item_id = p.id
             WHERE cpi.contribution_id = OLD.contribution_id),
            0
        )
        WHERE id = OLD.contribution_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER contribution_price_item_trigger
AFTER INSERT OR UPDATE OR DELETE ON contribution_price_items
FOR EACH ROW
EXECUTE FUNCTION update_contribution_total();
```

Update user has contributed

```sql
-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS contribution_update_user_trigger ON contributions;

CREATE OR REPLACE FUNCTION update_user_contributions()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the user has any contributions after INSERT, UPDATE, or DELETE
    UPDATE users
    SET has_contributed = EXISTS (SELECT 1 FROM contributions WHERE user_id = NEW.user_id)
    WHERE id = NEW.user_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER contribution_update_user_trigger
AFTER INSERT OR UPDATE OR DELETE ON contributions
FOR EACH ROW
EXECUTE FUNCTION update_user_contributions();
```