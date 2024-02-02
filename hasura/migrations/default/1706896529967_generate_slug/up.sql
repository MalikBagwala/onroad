-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS before_insert_update_generate_slug ON variants;

-- Create a function to generate and set the slug
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
-- Generate the kebab case slug from the name field
NEW.slug := lower(regexp_replace(NEW.name, '[^\w\s]', '', 'g'));
NEW.slug := regexp_replace(NEW.slug, '\s+', '-', 'g');
-- Append a 10-character hex for uniqueness
NEW.slug := NEW.slug || '-' || substring(md5(random()::text), 1, 10);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to invoke the function before insert or update
CREATE TRIGGER before_insert_update_generate_slug
BEFORE INSERT OR UPDATE ON variants
FOR EACH ROW
EXECUTE FUNCTION generate_slug();