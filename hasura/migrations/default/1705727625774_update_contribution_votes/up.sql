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
