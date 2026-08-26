#!/usr/bin/env python3
"""
Aether — Pricing & Unit Economics Model
Builds Aether_Pricing_Model.xlsx from the Feasibility Study's revised (current-law)
unit-economics baseline (Section 6) plus the source Operating/Full Build docs' pricing
and portfolio sketch (Sections 8-9). All formulas, no hardcoded results, per the xlsx
skill's requirements.
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

BLUE = Font(color="0000FF")
BLACK = Font(color="000000")
BOLD = Font(bold=True)
BOLD_WHITE = Font(bold=True, color="FFFFFF")
TITLE = Font(bold=True, size=14, color="0F3D22")
SECTION = Font(bold=True, size=11, color="1B7A3D")
YELLOW = PatternFill("solid", fgColor="FFFF00")
HEADER_FILL = PatternFill("solid", fgColor="0F3D22")
NOTE = Font(italic=True, color="595959", size=9)
CURRENCY = '$#,##0;($#,##0);-'
PCT = '0.0%'
THIN = Border(bottom=Side(style='thin', color='BFBFBF'))

wb = Workbook()

def style_input(cell, value, fmt=None):
    cell.value = value
    cell.font = BLUE
    cell.fill = YELLOW
    if fmt:
        cell.number_format = fmt

def header_row(ws, row, labels, widths=None):
    for i, label in enumerate(labels, start=1):
        c = ws.cell(row=row, column=i, value=label)
        c.font = BOLD_WHITE
        c.fill = HEADER_FILL

# ============================================================
# SHEET 1 — Assumptions
# ============================================================
ws = wb.active
ws.title = "Assumptions"
ws["A1"] = "AETHER — Pricing & Unit Economics Model"
ws["A1"].font = TITLE
ws["A2"] = "Built from Aether_Feasibility_Study.docx Section 6 (revised, current-law baseline). Yellow cells are inputs — change them to re-run every downstream sheet."
ws["A2"].font = NOTE

labels = [
    ("PEPM price (per employee per month)", 10.00, CURRENCY, "Operating Plan Section 8"),
    ("Avg employees per customer (illustrative)", 180, '0', "Operating Plan Section 9 illustrative firm"),
    ("Pay cycles per year", 26, '0', "Biweekly, per Operating Plan Section 9"),
    ("Loaded admin hourly rate", 45.00, CURRENCY, "Operating Plan Section 9"),
    ("Admin hours saved per cycle — low", 3, '0.0', "Operating Plan Section 9"),
    ("Admin hours saved per cycle — high", 6, '0.0', "Operating Plan Section 9"),
    ("State/training + R&D credits found per year — low", 5000, CURRENCY, "Feasibility Study Section 6 — current-law baseline, WOTC excluded"),
    ("State/training + R&D credits found per year — high", 25000, CURRENCY, "Feasibility Study Section 6 — current-law baseline, WOTC excluded"),
    ("WOTC upside if Congress renews — low", 13000, CURRENCY, "Difference vs. original $18k-$60k illustrative range that included WOTC"),
    ("WOTC upside if Congress renews — high", 35000, CURRENCY, "Difference vs. original $18k-$60k illustrative range that included WOTC"),
    ("WOTC renewed this year? (1 = yes, 0 = no)", 0, '0', "Feasibility Study Section 4 — WOTC lapsed for new hires after 2025-12-31; set to 1 only once Congress actually renews it"),
    ("Aether credit-share take rate, year 1", 0.18, PCT, "Operating Plan Section 8 — 15-20%, stepping down; 18% used as midpoint"),
    ("Avoided-quit value — low", 8000, CURRENCY, "Operating Plan Section 9"),
    ("Avoided-quit value — high", 15000, CURRENCY, "Operating Plan Section 9"),
    ("Target gross margin on software PEPM", 0.75, PCT, "Feasibility Study Section 6 — 'mid-70s', software PEPM only"),
    ("Portfolio-level avg employees per customer", 150, '0', "Matches Full Build Section 9's 200-customer / $3.6M ARR sketch — used only on the Portfolio sheet"),
]
row = 4
header_row(ws, row, ["Assumption", "Value", "Source / note"])
ws.row_dimensions[row].height = 18
row += 1
first_input_row = row
for label, val, fmt, note in labels:
    ws.cell(row=row, column=1, value=label)
    style_input(ws.cell(row=row, column=2), val, fmt)
    n = ws.cell(row=row, column=3, value=note)
    n.font = NOTE
    row += 1
last_input_row = row - 1

# name the key rows for readability elsewhere via absolute refs (kept simple/explicit instead of Excel named ranges)
ROWS = {
    "pepm": first_input_row + 0,
    "avg_emp": first_input_row + 1,
    "cycles": first_input_row + 2,
    "admin_rate": first_input_row + 3,
    "admin_hrs_lo": first_input_row + 4,
    "admin_hrs_hi": first_input_row + 5,
    "credits_lo": first_input_row + 6,
    "credits_hi": first_input_row + 7,
    "wotc_lo": first_input_row + 8,
    "wotc_hi": first_input_row + 9,
    "wotc_toggle": first_input_row + 10,
    "take_rate": first_input_row + 11,
    "quit_lo": first_input_row + 12,
    "quit_hi": first_input_row + 13,
    "margin": first_input_row + 14,
    "portfolio_avg_emp": first_input_row + 15,
}
A = "Assumptions"

ws.column_dimensions["A"].width = 48
ws.column_dimensions["B"].width = 16
ws.column_dimensions["C"].width = 70

# ============================================================
# SHEET 2 — Per-Customer Unit Economics
# ============================================================
ws2 = wb.create_sheet("Per-Customer Economics")
ws2["A1"] = "Illustrative Single Customer — Construction Firm"
ws2["A1"].font = TITLE
ws2["A2"] = "Mirrors Operating Plan Section 9's 180-employee illustrative firm, rebuilt on the Feasibility Study's current-law credit baseline."
ws2["A2"].font = NOTE

def row_label(ws, r, label, bold=False):
    c = ws.cell(row=r, column=1, value=label)
    if bold:
        c.font = BOLD

r = 4
header_row(ws2, r, ["Line", "Low", "High", "Note"]); r += 1
ws2.cell(row=r, column=1, value="Employees");
ws2.cell(row=r, column=2, value=f"='{A}'!B{ROWS['avg_emp']}").number_format = '0'
ws2.cell(row=r, column=3, value=f"='{A}'!B{ROWS['avg_emp']}").number_format = '0'
emp_row = r; r += 1

row_label(ws2, r, "Aether software revenue (PEPM), annual", True)
formula = f"='{A}'!B{ROWS['pepm']}*B{emp_row}*12"
ws2.cell(row=r, column=2, value=formula).number_format = CURRENCY
ws2.cell(row=r, column=3, value=formula).number_format = CURRENCY
ws2.cell(row=r, column=4, value="Stands alone — does not include credit-share or EWA, per the source plan's own instruction.").font = NOTE
software_rev_row = r; r += 1

row_label(ws2, r, "Credits found (customer value, current-law + contingent WOTC)")
ws2.cell(row=r, column=2, value=f"='{A}'!B{ROWS['credits_lo']}+'{A}'!B{ROWS['wotc_toggle']}*'{A}'!B{ROWS['wotc_lo']}").number_format = CURRENCY
ws2.cell(row=r, column=3, value=f"='{A}'!B{ROWS['credits_hi']}+'{A}'!B{ROWS['wotc_toggle']}*'{A}'!B{ROWS['wotc_hi']}").number_format = CURRENCY
ws2.cell(row=r, column=4, value="Value to the CUSTOMER, not Aether revenue — see credit-share row below.").font = NOTE
credits_row = r; r += 1

row_label(ws2, r, "Aether credit-share revenue, annual", True)
ws2.cell(row=r, column=2, value=f"=B{credits_row}*'{A}'!B{ROWS['take_rate']}").number_format = CURRENCY
ws2.cell(row=r, column=3, value=f"=C{credits_row}*'{A}'!B{ROWS['take_rate']}").number_format = CURRENCY
credit_rev_row = r; r += 1

row_label(ws2, r, "Admin time recovered (customer value), annual")
ws2.cell(row=r, column=2, value=f"='{A}'!B{ROWS['admin_hrs_lo']}*'{A}'!B{ROWS['cycles']}*'{A}'!B{ROWS['admin_rate']}").number_format = CURRENCY
ws2.cell(row=r, column=3, value=f"='{A}'!B{ROWS['admin_hrs_hi']}*'{A}'!B{ROWS['cycles']}*'{A}'!B{ROWS['admin_rate']}").number_format = CURRENCY
admin_row = r; r += 1

row_label(ws2, r, "One avoided quit (customer value, one-time)")
ws2.cell(row=r, column=2, value=f"='{A}'!B{ROWS['quit_lo']}").number_format = CURRENCY
ws2.cell(row=r, column=3, value=f"='{A}'!B{ROWS['quit_hi']}").number_format = CURRENCY
quit_row = r; r += 1

r += 1
row_label(ws2, r, "TOTAL Aether revenue (software + credit share)", True)
ws2.cell(row=r, column=2, value=f"=B{software_rev_row}+B{credit_rev_row}").number_format = CURRENCY
ws2.cell(row=r, column=3, value=f"=C{software_rev_row}+C{credit_rev_row}").number_format = CURRENCY
total_rev_row = r; r += 1

row_label(ws2, r, "TOTAL customer-visible value (credits + admin time + one avoided quit)", True)
ws2.cell(row=r, column=2, value=f"=B{credits_row}+B{admin_row}+B{quit_row}").number_format = CURRENCY
ws2.cell(row=r, column=3, value=f"=C{credits_row}+C{admin_row}+C{quit_row}").number_format = CURRENCY
total_value_row = r; r += 1

row_label(ws2, r, "Customer value delivered per $1 of software spend", True)
ws2.cell(row=r, column=2, value=f"=B{total_value_row}/B{software_rev_row}").number_format = '0.0"x"'
ws2.cell(row=r, column=3, value=f"=C{total_value_row}/C{software_rev_row}").number_format = '0.0"x"'
ws2.cell(row=r, column=4, value="The actual sales number: how many dollars of value show up for every dollar of PEPM spend.").font = NOTE

for col, w in zip("ABCD", [58, 16, 16, 70]):
    ws2.column_dimensions[col].width = w

# ============================================================
# SHEET 3 — Portfolio ARR Scale
# ============================================================
ws3 = wb.create_sheet("Portfolio ARR Scale")
ws3["A1"] = "Portfolio ARR at Scale"
ws3["A1"].font = TITLE
ws3["A2"] = "The 200-customer row reproduces Full Build Section 9's own sketch ($3.6M software ARR at 200 customers averaging 150 employees) as a sanity check on this model."
ws3["A2"].font = NOTE

r = 4
header_row(ws3, r, ["Customers", "Avg employees", "Software ARR", "Credit-share ARR — low", "Credit-share ARR — high", "Total Aether ARR — low", "Total Aether ARR — high"])
r += 1
first_portfolio_row = r
for n_customers in [20, 50, 100, 200, 500]:
    ws3.cell(row=r, column=1, value=n_customers).number_format = '0'
    ws3.cell(row=r, column=2, value=f"='{A}'!B{ROWS['portfolio_avg_emp']}").number_format = '0'
    ws3.cell(row=r, column=3, value=f"=A{r}*B{r}*'{A}'!B{ROWS['pepm']}*12").number_format = CURRENCY
    ws3.cell(row=r, column=4, value=f"=A{r}*'{A}'!B{ROWS['credits_lo']}*'{A}'!B{ROWS['take_rate']}").number_format = CURRENCY
    ws3.cell(row=r, column=5, value=f"=A{r}*'{A}'!B{ROWS['credits_hi']}*'{A}'!B{ROWS['take_rate']}").number_format = CURRENCY
    ws3.cell(row=r, column=6, value=f"=C{r}+D{r}").number_format = CURRENCY
    ws3.cell(row=r, column=7, value=f"=C{r}+E{r}").number_format = CURRENCY
    r += 1
ws3.cell(row=r, column=1, value="200-customer row should read ≈ $3,600,000 software ARR at the default 150-employee portfolio assumption — that's the built-in check.").font = NOTE

for col, w in zip("ABCDEFG", [12, 14, 16, 20, 20, 18, 18]):
    ws3.column_dimensions[col].width = w

# ============================================================
# SHEET 4 — Stage I Cash Needs
# ============================================================
ws4 = wb.create_sheet("Stage I Cash Needs")
ws4["A1"] = "Stage I Cash Needs (partial — fill in the blue cells)"
ws4["A1"].font = TITLE
ws4["A2"] = "SOC 2 figures are independently verified (Feasibility Study Section 6, Aug 2026). Counsel, insurance, and the spine hire's compensation are market-dependent — fill in real quotes as they come in."
ws4["A2"].font = NOTE

r = 4
header_row(ws4, r, ["Item", "Low", "High", "Note"]); r += 1
stage1_items = [
    ("SOC 2 Type I (audit fee + tooling + internal hours)", 20000, 60000, "Feasibility Study Section 6 — verified this session"),
    ("SOC 2 Type II (additional, ~9-12 months out)", 30000, 80000, "Feasibility Study Section 6 — verified this session"),
    ("Employment-tax / fintech counsel retainer (fill in)", 0, 0, "Market-dependent — get a real quote, see 02-Company-Ops/00-entity-and-legal"),
    ("Cyber / E&O / crime insurance, annual (fill in)", 0, 0, "Market-dependent — see 02-Company-Ops/02-insurance-and-risk"),
    ("Payroll-operations 'spine' hire, annualized comp (fill in)", 0, 0, "Market-dependent — see 02-Company-Ops/04-hiring-and-team"),
    ("Embedded rail integration / setup fee (fill in)", 0, 0, "Depends on ADR 0001 outcome — see 03-Product-OS/docs/architecture-decision-records"),
]
first_stage1_row = r
for label, lo, hi, note in stage1_items:
    ws4.cell(row=r, column=1, value=label)
    style_input(ws4.cell(row=r, column=2), lo, CURRENCY)
    style_input(ws4.cell(row=r, column=3), hi, CURRENCY)
    ws4.cell(row=r, column=4, value=note).font = NOTE
    r += 1
last_stage1_row = r - 1
r += 1
row_label(ws4, r, "TOTAL Stage I cash needs (this list only — not exhaustive)", True)
ws4.cell(row=r, column=2, value=f"=SUM(B{first_stage1_row}:B{last_stage1_row})").number_format = CURRENCY
ws4.cell(row=r, column=3, value=f"=SUM(C{first_stage1_row}:C{last_stage1_row})").number_format = CURRENCY

for col, w in zip("ABCD", [55, 14, 14, 60]):
    ws4.column_dimensions[col].width = w

wb.save("Aether_Pricing_Model.xlsx")
print("wrote Aether_Pricing_Model.xlsx")
