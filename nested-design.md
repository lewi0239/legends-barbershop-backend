# Nested Model Design — Legends Barbershop API

## MongoDB Collections Structure

```
  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
  │   clients       │    │    barbers       │    │    services     │
  ├─────────────────┤    ├─────────────────┤    ├─────────────────┤
  │ _id: ObjectId   │    │ _id: ObjectId   │    │ _id: ObjectId   │
  │ firstName       │    │ firstName       │    │ name            │
  │ lastName        │    │ lastName        │    │ price           │
  │ phoneNumber     │    │ phoneNumber     │    │ duration        │
  │ email           │    │ email           │    │ createdAt       │
  │ createdAt       │    │ createdAt       │    │ updatedAt       │
  │ updatedAt       │    │ updatedAt       │    └───────┬─────────┘
  └────────┬────────┘    └────────┬────────┘           │
           │                      │                     │
           │  ref: "Client"       │ ref: "Barber"       │ ref: "Service"
           ▼                      ▼                     ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        appointments                          │
  ├──────────────────────────────────────────────────────────────┤
  │  _id:      ObjectId                                          │
  │  client:   ObjectId ──────────────────────────► clients._id │
  │  barber:   ObjectId ──────────────────────────► barbers._id │
  │  service:  ObjectId ──────────────────────────► services._id│
  │  createdAt                                                   │
  │  updatedAt                                                   │
  └──────────────────────────────────────────────────────────────┘
```

## Request Flow Architecture

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────────────────┐
│                     ROUTES                          │
│  appointmentRoutes.ts                               │
│                                                     │
│  GET  /appointments       → getAppointments         │
│  GET  /appointments/:id   → getAppointmentById      │
│  POST /appointments       → createAppointment       │
└──────────────────┬──────────────────────────────────┘
                   │ calls
                   ▼
┌─────────────────────────────────────────────────────┐
│                  CONTROLLER                         │
│  appointmentController.ts                           │
│                                                     │
│  - Parses req.body / req.params                     │
│  - Calls the service function                       │
│  - Sends res.json(result)                           │
│  - Handles errors via next(error)                   │
└──────────────────┬──────────────────────────────────┘
                   │ calls
                   ▼
┌─────────────────────────────────────────────────────┐
│                   SERVICE                           │
│  appointmentServices.ts                             │
│                                                     │
│  ← THIS IS WHERE .populate() GOES                  │
│                                                     │
│  getAppointmentById → findById + populate all refs  │
│  createAppointment  → create with IDs only          │
└──────────────────┬──────────────────────────────────┘
                   │ queries
                   ▼
┌─────────────────────────────────────────────────────┐
│                    MODEL                            │
│  appointments.ts                                    │
│                                                     │
│  client:  { type: ObjectId, ref: "Client" }         │
│  barber:  { type: ObjectId, ref: "Barber" }         │
│  service: { type: ObjectId, ref: "Service" }        │
└──────────────────┬──────────────────────────────────┘
                   │ reads from
                   ▼
┌──────────────────────────────────────────────────────┐
│                   MongoDB                            │
│   appointments  ──► clients                         │
│   collection    ──► barbers    (via .populate())    │
│                 ──► services                        │
└──────────────────────────────────────────────────────┘
```

---

## Implementation Guide

Follow these steps in order when building a nested resource like Appointment.

### Step 1 — Finish the dependency models first
Before touching Appointment, make sure `Client`, `Barber`, and `Service` are each fully working Mongoose models with their own schema, interface, and exported model. Appointment depends on all three.

### Step 2 — Define the Appointment schema with ObjectId references
In the Appointment schema, each nested field stores only the `_id` of the related document. Set the type to `Schema.Types.ObjectId` and add a `ref` pointing to the model name string.

### Step 3 — Update the TypeScript interface
The Appointment interface fields should type the populated form (the full document type), even though the DB stores just an ObjectId. This keeps TypeScript accurate when you access populated data.

### Step 4 — Build the service functions
- **Create** — accept the IDs from the request body and pass them directly into the model. Do not populate on create.
- **Read (single)** — fetch by ID and chain `.populate()` for each ref field so the response returns full nested objects.
- **Read (all)** — same as single, populate all ref fields.
- **Update** — accept updated IDs from the request body and replace the stored ObjectIds. Do not populate on update.
- **Delete** — find by ID and delete. No populate needed.

### Step 5 — Build the controller
The controller only handles the HTTP layer. It reads from `req.body` or `req.params`, calls the matching service function, and returns the result via `res.json()`. Error handling goes through `next(error)`.

### Step 6 — Define the routes
Wire each HTTP method and path to its controller function. Follow the pattern already established in `barberRoutes.ts`.

### Step 7 — Register the routes in app.ts
Mount the appointment router under a `/appointments` prefix so all routes are scoped correctly.

### Step 8 — Test each endpoint in order
Test in this order to catch dependency issues early:
1. Create a client, barber, and service — note the returned `_id` for each
2. Create an appointment using those IDs
3. GET the appointment by ID and confirm the nested objects are fully populated
4. Update the appointment
5. Delete the appointment

---

## Rules to Remember

| Operation | What goes in the request body | What gets stored in DB | What gets returned |
|-----------|-------------------------------|------------------------|-------------------|
| POST      | clientId, barberId, serviceId | ObjectIds only         | created doc (no populate needed) |
| GET       | —                             | ObjectIds              | full nested docs via .populate() |
| PUT/PATCH | clientId, barberId, serviceId | updated ObjectIds      | updated doc |
| DELETE    | —                             | —                      | deleted doc |
