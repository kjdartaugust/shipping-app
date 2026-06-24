-- ============================================================================
-- SwiftShip — demo seed data
-- Run AFTER schema.sql, and AFTER you have registered at least one account.
-- It uses your most-recently-created profile as the sender, and (if one
-- exists) any 'agent' as the assigned courier. Re-running is safe: it skips
-- if demo shipments already exist.
-- ============================================================================

do $$
declare
  v_sender   uuid;
  v_agent    uuid;
  v_id       uuid;
begin
  -- Pick a sender (latest signup) and an optional agent.
  select id into v_sender from public.profiles order by created_at desc limit 1;
  select id into v_agent  from public.profiles where role = 'agent' limit 1;

  if v_sender is null then
    raise notice 'No profiles found — register an account first, then re-run.';
    return;
  end if;

  if exists (select 1 from public.shipments where tracking_number like 'SS-DEMO%') then
    raise notice 'Demo shipments already present — nothing to do.';
    return;
  end if;

  -- ---- Shipment 1: delivered (Accra -> Kumasi) -----------------------------
  insert into public.shipments (
    tracking_number, sender_id, agent_id, recipient_name, recipient_phone,
    origin_address, origin_lat, origin_lng, dest_address, dest_lat, dest_lng,
    package_type, weight_kg, declared_value, service_type, status, price,
    estimated_delivery, created_at
  ) values (
    'SS-DEMO12345', v_sender, v_agent, 'Kwame Boateng', '+233201112222',
    'Accra, Ghana', 5.6037, -0.1870, 'Kumasi, Ghana', 6.6885, -1.6244,
    'parcel', 3.5, 150, 'express', 'delivered', 78.40,
    now() - interval '1 day', now() - interval '4 days'
  ) returning id into v_id;

  -- Replace the trigger's single auto-event with a richer journey.
  delete from public.tracking_events where shipment_id = v_id;
  insert into public.tracking_events (shipment_id, status, location, lat, lng, note, created_at) values
    (v_id, 'pending',          'Accra, Ghana',           5.6037, -0.1870, 'Shipment booked',              now() - interval '4 days'),
    (v_id, 'confirmed',        'Accra Hub',              5.6037, -0.1870, 'Pickup scheduled',            now() - interval '4 days' + interval '3 hours'),
    (v_id, 'picked_up',        'Accra Hub',              5.6037, -0.1870, 'Collected from sender',       now() - interval '3 days'),
    (v_id, 'in_transit',       'Nsawam, Ghana',          5.8090, -0.3510, 'Departed Accra',              now() - interval '3 days' + interval '5 hours'),
    (v_id, 'out_for_delivery', 'Kumasi Depot',           6.6885, -1.6244, 'On vehicle for delivery',     now() - interval '1 day' - interval '4 hours'),
    (v_id, 'delivered',        'Kumasi, Ghana',          6.6885, -1.6244, 'Delivered — signed by K.B.',  now() - interval '1 day');

  -- ---- Shipment 2: in transit (Tema -> Tamale) -----------------------------
  insert into public.shipments (
    tracking_number, sender_id, agent_id, recipient_name, recipient_phone,
    origin_address, origin_lat, origin_lng, dest_address, dest_lat, dest_lng,
    package_type, weight_kg, declared_value, service_type, status, price,
    estimated_delivery, created_at
  ) values (
    'SS-DEMO67890', v_sender, v_agent, 'Akosua Frimpong', '+233244556677',
    'Tema, Ghana', 5.6698, -0.0166, 'Tamale, Ghana', 9.4008, -0.8393,
    'box', 8.0, 400, 'standard', 'in_transit', 64.20,
    now() + interval '2 days', now() - interval '1 day'
  ) returning id into v_id;

  delete from public.tracking_events where shipment_id = v_id;
  insert into public.tracking_events (shipment_id, status, location, lat, lng, note, created_at) values
    (v_id, 'pending',    'Tema, Ghana',       5.6698, -0.0166, 'Shipment booked',        now() - interval '1 day'),
    (v_id, 'confirmed',  'Tema Hub',          5.6698, -0.0166, 'Pickup scheduled',       now() - interval '22 hours'),
    (v_id, 'picked_up',  'Tema Hub',          5.6698, -0.0166, 'Collected from sender',  now() - interval '20 hours'),
    (v_id, 'in_transit', 'Kumasi, Ghana',     6.6885, -1.6244, 'At sorting hub',         now() - interval '6 hours');

  -- ---- Shipment 3: pending, unassigned (Takoradi -> Cape Coast) -----------
  insert into public.shipments (
    tracking_number, sender_id, recipient_name, recipient_phone,
    origin_address, origin_lat, origin_lng, dest_address, dest_lat, dest_lng,
    package_type, weight_kg, declared_value, service_type, status, price,
    estimated_delivery, created_at
  ) values (
    'SS-DEMO24680', v_sender, 'Yaw Mensah', '+233209998888',
    'Takoradi, Ghana', 4.8845, -1.7554, 'Cape Coast, Ghana', 5.1053, -1.2466,
    'fragile', 1.2, 90, 'overnight', 'pending', 49.10,
    now() + interval '1 day', now() - interval '3 hours'
  );

  -- ---- Shipment 4: out for delivery (Accra -> Tema) -----------------------
  insert into public.shipments (
    tracking_number, sender_id, agent_id, recipient_name, recipient_phone,
    origin_address, origin_lat, origin_lng, dest_address, dest_lat, dest_lng,
    package_type, weight_kg, declared_value, service_type, status, price,
    estimated_delivery, created_at
  ) values (
    'SS-DEMO13579', v_sender, v_agent, 'Efua Asante', '+233557776666',
    'Accra, Ghana', 5.6037, -0.1870, 'Tema, Ghana', 5.6698, -0.0166,
    'document', 0.5, 0, 'express', 'out_for_delivery', 31.80,
    now(), now() - interval '8 hours'
  ) returning id into v_id;

  delete from public.tracking_events where shipment_id = v_id;
  insert into public.tracking_events (shipment_id, status, location, lat, lng, note, created_at) values
    (v_id, 'pending',          'Accra, Ghana', 5.6037, -0.1870, 'Shipment booked',          now() - interval '8 hours'),
    (v_id, 'picked_up',        'Accra Hub',    5.6037, -0.1870, 'Collected from sender',    now() - interval '6 hours'),
    (v_id, 'out_for_delivery', 'Tema, Ghana',  5.6698, -0.0166, 'On vehicle for delivery',  now() - interval '1 hour');

  raise notice 'Seeded 4 demo shipments for sender %', v_sender;
end $$;
