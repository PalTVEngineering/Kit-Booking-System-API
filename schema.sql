--
-- PostgreSQL database dump
--

\restrict zO1PGfCMmNsYdaxKgFmEDFwUKsofZikUlOwYpoJLgTw3tOQcxJNka1xiWdBYcwB

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-08 15:28:31


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
-- TOC entry 223 (class 1259 OID 17346)
-- Name: booking_kits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_kits (
    booking_id integer NOT NULL,
    kit_id integer NOT NULL,
    quantity integer
);


ALTER TABLE public.booking_kits OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17329)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone,
    status character varying(20) DEFAULT 'active'::character varying
);
ALTER TABLE public.bookings ADD project_title character varying(100);
ALTER TABLE public.bookings OWNER TO postgres;
--
-- TOC entry 221 (class 1259 OID 17328)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 220 (class 1259 OID 17296)
-- Name: kit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kit (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(50) NOT NULL
);


ALTER TABLE public.kit OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17295)
-- Name: kit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kit_id_seq OWNER TO postgres;

--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 219
-- Name: kit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kit_id_seq OWNED BY public.kit.id;


--
-- TOC entry 218 (class 1259 OID 17291)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    email character varying(100),
    user_type INTEGER DEFAULT 0,           -- 0 = normal user, 1 = admin
    password VARCHAR(255) -- default password for new users
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17290)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4758 (class 2604 OID 17332)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 17299)
-- Name: kit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kit ALTER COLUMN id SET DEFAULT nextval('public.kit_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 17294)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4922 (class 0 OID 17346)
-- Dependencies: 223
-- Data for Name: booking_kits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_kits (booking_id, kit_id, quantity) FROM stdin;
\.


--
-- TOC entry 4921 (class 0 OID 17329)
-- Dependencies: 222
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, user_id, start_time, end_time, status) FROM stdin;
\.


--
-- TOC entry 4919 (class 0 OID 17296)
-- Dependencies: 220
-- Data for Name: kit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kit (id, name, type) FROM stdin;
1	Sony FX30	Camera
6	DJI Ronin Gimbal	Camera Equipment
7	Sigma 80 - 150mm f/2.8 lens	Camera Lens
8	Sony E-PZ 18 - 105mm f/4 lens 	Camera Lens
9	Camera Batteries	Camera Equipment (13)
10	Camera Battery Chargers	Camera Equipment (6)
11	Headphones	Sound (4)
12	Rode Wireless Microphone	Sound (7)
13	Attachable Mini Microphone	Sound (5)
14	Wireless Mic Stick	Sound (3)
15	Sigma 28-75mm f/2.8	Camera Lens
16	Light Batteries	Lighting (10)
17	Light Battery Charger	Lighting (8)
18	LED Light Head	Lighting (4)
19	Light Rig Tripod	Lighting (5)
20	Camera Tripod	Camera Equipment (4)
21	Smartphone Grip	Camera Equipment (3)
22	128GB SD Cards	Camera Equipment (10)
23	Variable ND Filters	Camera Equipment (5)
2	Sony A7 III	Camera (3)
\.


--
-- TOC entry 4917 (class 0 OID 17291)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email) FROM stdin;
2	John	Doe	example@email.com
\.


--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 18, true);


--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 219
-- Name: kit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kit_id_seq', 23, true);


--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 26, true);


--
-- TOC entry 4767 (class 2606 OID 17350)
-- Name: booking_kits booking_kits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_kits
    ADD CONSTRAINT booking_kits_pkey PRIMARY KEY (booking_id, kit_id);


--
-- TOC entry 4765 (class 2606 OID 17345)
-- Name: bookings bookings_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pk PRIMARY KEY (id);


--
-- TOC entry 4763 (class 2606 OID 17327)
-- Name: kit kit_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kit
    ADD CONSTRAINT kit_pk PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 17325)
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- TOC entry 4769 (class 2606 OID 17351)
-- Name: booking_kits fk_booking; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_kits
    ADD CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- TOC entry 4770 (class 2606 OID 17356)
-- Name: booking_kits fk_kit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_kits
    ADD CONSTRAINT fk_kit FOREIGN KEY (kit_id) REFERENCES public.kit(id);


--
-- TOC entry 4768 (class 2606 OID 17334)
-- Name: bookings fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-10-08 15:28:32

--
-- PostgreSQL database dump complete
--

\unrestrict zO1PGfCMmNsYdaxKgFmEDFwUKsofZikUlOwYpoJLgTw3tOQcxJNka1xiWdBYcwB

