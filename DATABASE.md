# DATABASE.md

# Rent Invoice Manager — Database Schema

Database: SQLite

This file defines the database tables owned by Dev 3.

Dev 3 owns the invoice processing pipeline:

```txt
Invoice Engine
PDF Generation
Email Sending
Archive Management
Business Rules Enforcement
```

Dev 3 owns these tables:

```txt
invoice_runs
invoices
archive_files
email_logs
```

---

# 1. invoice_runs

Stores each invoice generation cycle.

One invoice run represents one monthly generation cycle.

Example:

```txt
June 2026 invoice run
July 2026 invoice run
```

```sql
CREATE TABLE invoice_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  cycle_month TEXT NOT NULL UNIQUE,
  financial_year TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'draft',

  generated_at TEXT,
  regenerated_at TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## cycle_month format

```txt
YYYY-MM
```

Examples:

```txt
2026-04
2026-05
2026-06
```

## financial_year format

```txt
YY-YY
```

Examples:

```txt
26-27
27-28
```

## invoice_runs status values

```txt
draft
generated
partially_sent
sent
archived
```

---

# 2. invoices

Stores individual tenant invoices.

One row = one tenant invoice for one cycle.

```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  invoice_run_id INTEGER NOT NULL,

  tenant_id INTEGER NOT NULL,
  tenant_code TEXT NOT NULL,

  invoice_number TEXT NOT NULL UNIQUE,
  serial_number INTEGER NOT NULL,

  cycle_month TEXT NOT NULL,
  financial_year TEXT NOT NULL,
  invoice_date TEXT NOT NULL,

  rent_amount INTEGER NOT NULL,
  gst_amount INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,

  pdf_path TEXT,

  status TEXT NOT NULL DEFAULT 'generated',

  generated_at TEXT NOT NULL,
  regenerated_at TEXT,

  email_sent_at TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (invoice_run_id) REFERENCES invoice_runs(id)
);
```

## invoices status values

```txt
generated
previewed
sent
archived
regenerated
failed
```

## Important invoice rule

A tenant should have only one latest invoice per cycle.

```sql
CREATE UNIQUE INDEX idx_invoices_tenant_cycle
ON invoices (tenant_id, cycle_month);
```

## Recommended indexes

```sql
CREATE INDEX idx_invoices_cycle_month
ON invoices (cycle_month);

CREATE INDEX idx_invoices_tenant_id
ON invoices (tenant_id);

CREATE INDEX idx_invoices_invoice_run_id
ON invoices (invoice_run_id);
```

---

# 3. archive_files

Stores archived PDF invoice file details.

Archive keeps records forever.

Folder structure:

```txt
archive/
  2026/
    June/
    July/
    August/
```

```sql
CREATE TABLE archive_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  invoice_id INTEGER NOT NULL,
  invoice_run_id INTEGER NOT NULL,

  tenant_id INTEGER NOT NULL,
  tenant_code TEXT NOT NULL,

  invoice_number TEXT NOT NULL,
  cycle_month TEXT NOT NULL,
  financial_year TEXT NOT NULL,

  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,

  archived_at TEXT NOT NULL,

  created_at TEXT NOT NULL,

  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (invoice_run_id) REFERENCES invoice_runs(id)
);
```

## Recommended indexes

```sql
CREATE INDEX idx_archive_files_invoice_id
ON archive_files (invoice_id);

CREATE INDEX idx_archive_files_cycle_month
ON archive_files (cycle_month);

CREATE INDEX idx_archive_files_tenant_id
ON archive_files (tenant_id);
```

---

# 4. email_logs

Stores email sending results.

Every send attempt should be logged.

Successful sends and failed sends must both be recorded.

```sql
CREATE TABLE email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  invoice_id INTEGER NOT NULL,
  invoice_run_id INTEGER NOT NULL,

  tenant_id INTEGER NOT NULL,

  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,

  status TEXT NOT NULL,

  provider TEXT NOT NULL DEFAULT 'gmail_smtp',

  error_message TEXT,

  sent_at TEXT,
  created_at TEXT NOT NULL,

  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (invoice_run_id) REFERENCES invoice_runs(id)
);
```

## email_logs status values

```txt
pending
sent
failed
```

## Recommended indexes

```sql
CREATE INDEX idx_email_logs_invoice_id
ON email_logs (invoice_id);

CREATE INDEX idx_email_logs_status
ON email_logs (status);

CREATE INDEX idx_email_logs_created_at
ON email_logs (created_at);
```

---

# Business Rules Supported By This Schema

## Invoice number format

```txt
AJ/<TenantCode>/<Serial>/<FinancialYear>
```

Example:

```txt
AJ/CP/2/26-27
```

---

## Latest generated cycle

The latest generated cycle can be found using:

```sql
SELECT cycle_month
FROM invoice_runs
ORDER BY cycle_month DESC
LIMIT 1;
```

---

## Next cycle

If the latest generated cycle is:

```txt
2026-06
```

then the next cycle is:

```txt
2026-07
```

---

## Regeneration rule

Only the latest generated cycle can be regenerated.

Example:

```txt
Latest cycle: 2026-06

Allowed:
2026-06

Blocked:
2026-04
2026-05
```

---

## Serial number rule

Serial number is tenant-specific and financial-year-specific.

Example:

```txt
April 2026:
AJ/CP/1/26-27
AJ/XYZ/1/26-27

May 2026:
AJ/CP/2/26-27
AJ/XYZ/2/26-27
```

To get the next serial:

```sql
SELECT MAX(serial_number)
FROM invoices
WHERE tenant_id = ?
AND financial_year = ?;
```

If no previous serial exists, next serial is:

```txt
1
```

Otherwise:

```txt
max_serial + 1
```

---

## Archive rule

Archive records are never deleted.

Archive stores:

```txt
PDF path
Invoice metadata
Generation timestamp
Tenant information
Financial year
Cycle month
```

---

# Dev 3 Build Order

1. Financial year calculation
2. Invoice numbering
3. Invoice cycle logic
4. Database tables
5. PDF generation
6. Archive storage
7. Email sending
8. Frontend integration
