-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS contribution_update_user_trigger ON contributions;

CREATE OR REPLACE FUNCTION update_user_contributions()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the user has any contributions after INSERT or UPDATE
    IF TG_OP = 'DELETE' THEN
        UPDATE users
        SET has_contributed = EXISTS (SELECT 1 FROM contributions WHERE user_id = OLD.user_id)
        WHERE id = OLD.user_id;
    ELSE
        UPDATE users
        SET has_contributed = EXISTS (SELECT 1 FROM contributions WHERE user_id = NEW.user_id)
        WHERE id = NEW.user_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER contribution_update_user_trigger
AFTER INSERT OR UPDATE OR DELETE ON contributions
FOR EACH ROW
EXECUTE FUNCTION update_user_contributions();
