--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 15.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: customer_type_enum; Type: TYPE; Schema: public; Owner: crmuser
--

CREATE TYPE public.customer_type_enum AS ENUM (
    'PRIVATE',
    'BUSINESS'
);


ALTER TYPE public.customer_type_enum OWNER TO crmuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: crmuser
--

CREATE TABLE public.customer (
    id integer NOT NULL,
    name character varying NOT NULL,
    "tenantId" character varying NOT NULL,
    email character varying,
    phone character varying,
    type public.customer_type_enum DEFAULT 'PRIVATE'::public.customer_type_enum NOT NULL,
    address character varying,
    "postalCode" character varying,
    city character varying,
    country character varying DEFAULT 'Norge'::character varying NOT NULL,
    "organizationNumber" character varying,
    "companyName" character varying,
    department character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.customer OWNER TO crmuser;

--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: crmuser
--

CREATE SEQUENCE public.customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_id_seq OWNER TO crmuser;

--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: crmuser
--

ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;


--
-- Name: invoice; Type: TABLE; Schema: public; Owner: crmuser
--

CREATE TABLE public.invoice (
    id integer NOT NULL,
    "customerId" integer NOT NULL,
    amount numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.invoice OWNER TO crmuser;

--
-- Name: invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: crmuser
--

CREATE SEQUENCE public.invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoice_id_seq OWNER TO crmuser;

--
-- Name: invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: crmuser
--

ALTER SEQUENCE public.invoice_id_seq OWNED BY public.invoice.id;


--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: crmuser
--

ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);


--
-- Name: invoice id; Type: DEFAULT; Schema: public; Owner: crmuser
--

ALTER TABLE ONLY public.invoice ALTER COLUMN id SET DEFAULT nextval('public.invoice_id_seq'::regclass);


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: crmuser
--

COPY public.customer (id, name, "tenantId", email, phone, type, address, "postalCode", city, country, "organizationNumber", "companyName", department, "createdAt", "updatedAt", "isActive") FROM stdin;
2	Test Kunde AS	dev-tenant	\N	\N	PRIVATE	\N	\N	\N	Norge	\N	\N	\N	2025-05-08 19:59:25.421655	2025-05-08 19:59:25.421655	t
\.


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: crmuser
--

COPY public.invoice (id, "customerId", amount, "createdAt") FROM stdin;
\.


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: crmuser
--

SELECT pg_catalog.setval('public.customer_id_seq', 2, true);


--
-- Name: invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: crmuser
--

SELECT pg_catalog.setval('public.invoice_id_seq', 1, false);


--
-- Name: invoice PK_15d25c200d9bcd8a33f698daf18; Type: CONSTRAINT; Schema: public; Owner: crmuser
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY (id);


--
-- Name: customer PK_a7a13f4cacb744524e44dfdad32; Type: CONSTRAINT; Schema: public; Owner: crmuser
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

