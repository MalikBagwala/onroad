SET check_function_bodies = false;
INSERT INTO public.auth_group (id, name) VALUES (1, 'user');
INSERT INTO public.auth_group (id, name) VALUES (2, 'contributor');
INSERT INTO public.auth_group (id, name) VALUES (3, 'admin');
INSERT INTO public.auth_group (id, name) VALUES (4, 'staff');
SELECT pg_catalog.setval('public.auth_group_id_seq', 4, true);
