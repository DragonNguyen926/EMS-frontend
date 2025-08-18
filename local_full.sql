--
-- PostgreSQL database dump
--

\restrict tJYYHL9P115gmMwN4ZkbE6ygbBPLy4feyNSXNzWgefM0fFmqcQQf9BjdcqfBTHz

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    task_date date,
    category text,
    active boolean DEFAULT false,
    assigned_to integer,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    new_task boolean DEFAULT false,
    completed boolean DEFAULT false,
    failed boolean DEFAULT false
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name text,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'active'::text NOT NULL,
    group_id integer,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['employee'::text, 'admin'::text, 'dev'::text])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.groups (id, name, created_at) FROM stdin;
2	IT Team	2025-08-15 10:41:32.182666+07
3	Board	2025-08-15 10:41:32.182666+07
4	Marketing Team	2025-08-15 12:40:21.100486+07
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (id, title, description, task_date, category, active, assigned_to, created_by, created_at, new_task, completed, failed) FROM stdin;
1	Quay Phim	nho hun long mot cai	2025-08-15	Film	f	2	1	2025-08-14 23:03:30.745652	f	f	t
3	rua chen	 trong hom nay	2025-08-22	don dep	f	3	4	2025-08-15 12:46:45.070162	f	f	t
2	C++	Learn STACK	2025-08-23	CODE	f	3	4	2025-08-15 12:42:01.680279	f	t	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, first_name, email, password, role, created_at, status, group_id) FROM stdin;
2	Thuy	thuy@ramp.mem	$2b$10$ymsVWYPcEFhGzJovZ/2DpuM8l/eAhSePpifevPso/A121Nvluoi3.	employee	2025-08-14 23:01:58.782008	active	\N
1	DRAGON	dg@ramp.mem	$2b$10$W.vX3ijeOLYtxMCJbLxeeu2VtdjfXjPv56J8cMGH29dC.ydPYnQyW	dev	2025-08-14 22:53:04.430521	active	\N
3	Long	long@ramp.mem	$2b$10$zywFFzjWQrot//.01FClK.Ik.ufFGh54r/Q7CGnCP6DMbvryjp2s.	employee	2025-08-15 11:33:56.664672	active	3
4	Long	board@ramp.mem	$2b$10$tx.I8sTtLCr9M9tJj6J/UOgH4WsZRVUESb8SJlao2811b3hiaDaQe	admin	2025-08-15 11:36:40.908028	active	3
\.


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.groups_id_seq', 4, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tasks_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: groups groups_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_name_key UNIQUE (name);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_email_unique_ci; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_unique_ci ON public.users USING btree (lower(email));


--
-- Name: users_group_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_group_id_idx ON public.users USING btree (group_id);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: users_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_status_idx ON public.users USING btree (status);


--
-- Name: tasks tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: tasks tasks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: users users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict tJYYHL9P115gmMwN4ZkbE6ygbBPLy4feyNSXNzWgefM0fFmqcQQf9BjdcqfBTHz

