-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS before_insert_or_update_make ON makes;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_make_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the code is already provided by the user
    IF NEW.code IS NULL THEN
        -- If not, generate the code from the first three characters of the capitalized name
        NEW.code = UPPER(SUBSTRING(NEW.name FROM 1 FOR 3));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER before_insert_or_update_make
BEFORE INSERT OR UPDATE
ON makes
FOR EACH ROW
EXECUTE FUNCTION update_make_code();
