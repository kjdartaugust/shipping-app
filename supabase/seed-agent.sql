-- ============================================================================
-- SwiftShip — demo delivery agent + assignment showcase
-- Makes the assign-agent → agent-deliveries flow demoable end to end.
--
-- HOW TO USE:
--   1. Register a SECOND account in the app to act as the courier
--      (e.g. agent@swiftship.test). This creates its auth user + profile.
--   2. Replace 'AGENT_EMAIL_HERE' below with that account's email.
--   3. Run this in the Supabase SQL editor (after schema.sql + seed.sql).
--
-- It promotes that account to 'agent' and assigns the demo shipments to it,
-- so signing in as the agent shows a populated "My Deliveries" queue, and the
-- admin "Assign agent" dropdown lists this courier. Safe to re-run.
-- ============================================================================

do $$
declare
  v_agent_email text := 'AGENT_EMAIL_HERE';   -- <-- change me
  v_agent uuid;
  v_assigned int;
begin
  select id into v_agent from public.profiles where email = v_agent_email;

  if v_agent is null then
    raise notice 'No account found for %, register it first, then re-run.', v_agent_email;
    return;
  end if;

  -- Promote to delivery agent.
  update public.profiles set role = 'agent' where id = v_agent;

  -- Assign every demo shipment that is still moving (not delivered/cancelled)
  -- to this agent so the deliveries queue has live work to show.
  update public.shipments
     set agent_id = v_agent
   where tracking_number like 'SS-DEMO%'
     and status not in ('delivered', 'cancelled');

  get diagnostics v_assigned = row_count;

  -- Welcome the agent.
  insert into public.notifications (user_id, title, message, type, link)
  values (
    v_agent,
    'Welcome to the delivery team',
    'You have been assigned ' || v_assigned || ' shipment(s) to deliver.',
    'info',
    '/dashboard/deliveries'
  );

  raise notice 'Promoted % to agent and assigned % active demo shipment(s).',
    v_agent_email, v_assigned;
end $$;
