-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS contribution_price_item_trigger ON contribution_price_items;

CREATE OR REPLACE FUNCTION update_contribution_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the total and set status to 'pending' for the affected contribution
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE contributions
        SET total = COALESCE(
            (SELECT SUM(CASE WHEN p.type = 'DB' THEN cpi.value ELSE -cpi.value END)
             FROM contribution_price_items cpi
             JOIN price_items p ON cpi.price_item_id = p.id
             WHERE cpi.contribution_id = NEW.contribution_id),
            0),
            status = 'PD'  -- Set status as pending
        WHERE id = NEW.contribution_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE contributions
        SET total = COALESCE(
            (SELECT SUM(CASE WHEN p.type = 'DB' THEN cpi.value ELSE -cpi.value END)
             FROM contribution_price_items cpi
             JOIN price_items p ON cpi.price_item_id = p.id
             WHERE cpi.contribution_id = OLD.contribution_id),
            0),
            status = 'PD'  -- Set status as pending
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
