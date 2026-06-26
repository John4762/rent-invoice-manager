import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { RentalInvoiceDraft } from "../lib/invoiceEngine";
import { formatIndianCurrency } from "../lib/invoiceEngine";

type RentalInvoicePdfProps = {
  invoice: RentalInvoiceDraft;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingLeft: 46,
    paddingRight: 46,
    paddingBottom: 24,
    fontSize: 13,
    fontFamily: "Times-Roman",
    color: "#000000",
  },

  bold: {
    fontFamily: "Times-Bold",
  },

  landlordBlock: {
    marginLeft: 335,
    width: 210,
    marginBottom: 18,
  },

  line: {
    marginBottom: 2,
  },

  invoiceMeta: {
    marginLeft: 345,
    marginBottom: 4,
  },

  title: {
    marginTop: 4,
    marginBottom: 14,
    fontFamily: "Times-Bold",
    fontSize: 13,
  },

  tenantBlock: {
    width: 260,
    marginBottom: 12,
  },

  centerGstin: {
    textAlign: "center",
    fontFamily: "Times-Bold",
    marginBottom: 14,
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
  },

  row: {
    flexDirection: "row",
  },

  headerCell: {
    borderRightWidth: 1,
    borderRightColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 6,
    fontFamily: "Times-Bold",
    textAlign: "center",
  },

  headerCellLast: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 6,
    fontFamily: "Times-Bold",
    textAlign: "center",
  },

  particularsCol: {
    flex: 1,
  },

  sacCol: {
    width: 85,
  },

  amountCol: {
    width: 110,
  },

  particularsBody: {
    flex: 1,
    minHeight: 125,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    padding: 6,
  },

  sacBody: {
    width: 85,
    minHeight: 125,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    paddingTop: 60,
    textAlign: "center",
  },

  amountBody: {
    width: 110,
    minHeight: 125,
    paddingTop: 60,
    paddingRight: 8,
    textAlign: "right",
  },

  rentLine: {
    marginBottom: 14,
  },

  locationLabel: {
    marginBottom: 3,
  },

  gstLabelCell: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingVertical: 2,
    paddingLeft: 8,
  },

  gstPercentCell: {
    width: 55,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingVertical: 2,
    textAlign: "center",
  },

  gstAmountLeftCell: {
    width: 90,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    paddingVertical: 2,
    paddingRight: 6,
    textAlign: "right",
  },

  emptySacCell: {
    width: 85,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },

  emptyAmountCell: {
    width: 110,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },

  gstLabelCellNoTop: {
    flex: 1,
    paddingVertical: 2,
    paddingLeft: 8,
  },

  gstPercentCellNoTop: {
    width: 55,
    paddingVertical: 2,
    textAlign: "center",
  },

  gstAmountLeftCellNoTop: {
    width: 90,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    paddingVertical: 2,
    paddingRight: 6,
    textAlign: "right",
  },

  emptySacCellNoTop: {
    width: 85,
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },

  emptyAmountCellNoTop: {
    width: 110,
  },

  totalLabelCell: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    paddingVertical: 3,
    paddingLeft: 8,
  },

  totalGstAmountCell: {
    width: 85,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    paddingVertical: 3,
    paddingRight: 6,
    textAlign: "right",
  },

  totalAmountCell: {
    width: 110,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingVertical: 3,
    paddingRight: 8,
    textAlign: "right",
  },

  grandLabelCell: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    paddingVertical: 3,
    paddingLeft: 8,
  },

  grandAmountCell: {
    width: 110,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingVertical: 3,
    paddingRight: 8,
    textAlign: "right",
  },

  wordsBlock: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 5,
    paddingHorizontal: 8,
    paddingBottom: 5,
    fontFamily: "Times-Bold",
  },

  signatoryBlock: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingHorizontal: 8,
    paddingTop: 10,
    height: 112,
    position: "relative",
  },

  signatoryName: {
    fontFamily: "Times-Bold",
    marginBottom: 65,
  },

  signatureImage: {
    position: "absolute",
    left: 8,
    top: 34,
    width: 130,
    height: 42,
    objectFit: "contain",
  },

  authorizedSignatoryText: {
    marginBottom: 0,
  },
});

export function RentalInvoicePdf({ invoice }: RentalInvoicePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.landlordBlock}>
          <Text style={[styles.line, styles.bold]}>{invoice.landlord.name}</Text>
          <Text style={styles.line}>Pan No: {invoice.landlord.pan}</Text>
          <Text style={[styles.line, styles.bold]}>
            GSTIN: {invoice.landlord.gstin}
          </Text>

          {invoice.landlord.addressLines.map((line, index) => (
            <Text key={`addr-${index}`} style={styles.line}>
              {line}
            </Text>
          ))}
        </View>

        <View style={styles.invoiceMeta}>
          <Text style={styles.line}>Date: {invoice.invoiceDate}</Text>
          <Text style={styles.line}>Invoice No:{invoice.invoiceNumber}</Text>
        </View>

        <Text style={styles.title}>
          Rental Invoice for the Month of {invoice.invoiceMonthLabel}
        </Text>

        <View style={styles.tenantBlock}>
          <Text style={styles.line}>To,</Text>

          {invoice.tenant.billingAddressLines.map((line, index) => (
            <Text key={`bill-${index}`} style={styles.line}>
              {line}
              {index < invoice.tenant.billingAddressLines.length - 1 ? "," : ""}
            </Text>
          ))}
        </View>

        {invoice.tenant.gstin ? (
          <Text style={styles.centerGstin}>GSTIN: {invoice.tenant.gstin}</Text>
        ) : null}

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.headerCell, styles.particularsCol]}>
              Particulars
            </Text>

            <Text style={[styles.headerCell, styles.sacCol]}>
              SAC{"\n"}Code
            </Text>

            <Text style={[styles.headerCellLast, styles.amountCol]}>
              Amount
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.particularsBody}>
              <Text style={styles.rentLine}>{invoice.particulars}</Text>
              <Text style={styles.locationLabel}>Location Address:</Text>

              {invoice.tenant.locationAddressLines.map((line, index) => (
                <Text key={`loc-${index}`} style={styles.line}>
                  {line}
                  {index < invoice.tenant.locationAddressLines.length - 1
                    ? ","
                    : ""}
                </Text>
              ))}
            </View>

            <Text style={styles.sacBody}>{invoice.sacCode}</Text>

            <Text style={styles.amountBody}>
              {formatIndianCurrency(invoice.rentAmount)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.gstLabelCell}>CGST</Text>

            <Text style={styles.gstPercentCell}>{invoice.cgstRate}%</Text>

            <Text style={styles.gstAmountLeftCell}>
              {formatIndianCurrency(invoice.cgstAmount)}
            </Text>

            <Text style={styles.emptySacCell} />
            <Text style={styles.emptyAmountCell} />
          </View>

          <View style={styles.row}>
            <Text style={styles.gstLabelCellNoTop}>SGST</Text>

            <Text style={styles.gstPercentCellNoTop}>{invoice.sgstRate}%</Text>

            <Text style={styles.gstAmountLeftCellNoTop}>
              {formatIndianCurrency(invoice.sgstAmount)}
            </Text>

            <Text style={styles.emptySacCellNoTop} />
            <Text style={styles.emptyAmountCellNoTop} />
          </View>

          <View style={styles.row}>
            <Text style={styles.totalLabelCell}>Total</Text>

            <Text style={styles.totalGstAmountCell}>
              {formatIndianCurrency(invoice.totalGstAmount)}
            </Text>

            <Text style={styles.totalAmountCell}>
              {formatIndianCurrency(invoice.totalGstAmount)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.grandLabelCell}>Grand Total</Text>

            <Text style={styles.grandAmountCell}>
              {formatIndianCurrency(invoice.grandTotalRounded)}
            </Text>
          </View>

          <View style={styles.wordsBlock}>
            <Text>{invoice.amountInWords}</Text>
          </View>

          <View style={styles.signatoryBlock}>
            <Text style={styles.signatoryName}>
              {invoice.authorizedSignatory}
            </Text>

            {invoice.landlord.signatureImageSrc ? (
              <Image
                src={invoice.landlord.signatureImageSrc}
                style={styles.signatureImage}
              />
            ) : null}

            <Text style={styles.authorizedSignatoryText}>
              Authorized Signatory
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}