// ============================================
// M7 Distribution Platform - Invoice Generator
// ============================================

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Order, Customer, Product } from './types'

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable
  }
}

export interface InvoiceData {
  order: Order
  customer: Customer
  items: Array<{
    product: Product
    quantity_bags: number
    quantity_kg: number
    price_per_bag: number
    subtotal: number
  }>
  companyInfo?: {
    name: string
    address: string
    phone: string
    gst?: string
  }
}

/**
 * Generate a professional invoice PDF for an order
 * @param data - Invoice data including order, customer, and items
 * @returns jsPDF instance ready to save/download
 */
export function generateInvoice(data: InvoiceData): jsPDF {
  const doc = new jsPDF()

  // Company info (default M7 branding)
  const companyInfo = data.companyInfo || {
    name: 'M7 Distribution',
    address: 'Azadpur Mandi, Delhi, India',
    phone: '+91-9876543210',
    gst: 'GST123456789',
  }

  // Neon gradient colors (as RGB for PDF)
  const neonPurple: [number, number, number] = [168, 85, 247]
  const darkBg: [number, number, number] = [10, 10, 10]
  const textWhite: [number, number, number] = [255, 255, 255]
  const textGray: [number, number, number] = [156, 163, 175]

  // ============================================
  // HEADER - Company Branding
  // ============================================
  doc.setFillColor(neonPurple[0], neonPurple[1], neonPurple[2])
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2])
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('M7', 14, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Intelligent B2B Distribution Platform', 14, 28)

  // Invoice title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 160, 20)

  // Invoice number and date
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invoice #: ${data.order.id.substring(0, 8).toUpperCase()}`, 160, 28)
  doc.text(`Date: ${new Date(data.order.order_date).toLocaleDateString('en-IN')}`, 160, 33)

  // ============================================
  // COMPANY & CUSTOMER INFO
  // ============================================
  doc.setTextColor(darkBg[0], darkBg[1], darkBg[2])

  // Company details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('From:', 14, 50)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(companyInfo.name, 14, 56)
  doc.text(companyInfo.address, 14, 61)
  doc.text(companyInfo.phone, 14, 66)
  if (companyInfo.gst) {
    doc.text(`GST: ${companyInfo.gst}`, 14, 71)
  }

  // Customer details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Bill To:', 120, 50)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(data.customer.name, 120, 56)
  doc.text(data.customer.shop_name, 120, 61)
  doc.text(data.customer.phone, 120, 66)
  if (data.customer.location_geo) {
    doc.text(data.customer.location_geo, 120, 71)
  }

  // ============================================
  // ORDER ITEMS TABLE
  // ============================================
  const tableData = data.items.map((item) => [
    item.product.name,
    item.quantity_bags.toString(),
    `${item.quantity_kg.toFixed(2)} kg`,
    `₹${item.price_per_bag.toLocaleString('en-IN')}`,
    `₹${item.subtotal.toLocaleString('en-IN')}`,
  ])

  autoTable(doc, {
    startY: 85,
    head: [['Product', 'Bags', 'Weight', 'Price/Bag', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: neonPurple,
      textColor: textWhite,
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] as [number, number, number],
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  })

  // ============================================
  // TOTALS SECTION
  // ============================================
  const finalY = (doc as any).lastAutoTable.finalY || 150

  // Payment status badge
  const paymentType = data.order.payment_type.toUpperCase()
  const isPaid = data.order.is_paid
  const statusColor: [number, number, number] = isPaid ? [34, 197, 94] : [239, 68, 68] // green or red
  const statusText = isPaid ? 'PAID' : 'UNPAID'

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2])
  doc.roundedRect(14, finalY + 10, 40, 8, 2, 2, 'F')
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2])
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(statusText, 34, finalY + 16, { align: 'center' })

  // Payment type
  doc.setTextColor(darkBg[0], darkBg[1], darkBg[2])
  doc.setFont('helvetica', 'normal')
  doc.text(`Payment Type: ${paymentType}`, 14, finalY + 25)

  // Total amount
  doc.setDrawColor(neonPurple[0], neonPurple[1], neonPurple[2])
  doc.setLineWidth(0.5)
  doc.line(120, finalY + 10, 196, finalY + 10)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', 120, finalY + 20)
  doc.text(
    `₹${data.order.total_amount.toLocaleString('en-IN')}`,
    196,
    finalY + 20,
    { align: 'right' }
  )

  doc.setLineWidth(1)
  doc.line(120, finalY + 22, 196, finalY + 22)

  // ============================================
  // FOOTER
  // ============================================
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(textGray[0], textGray[1], textGray[2])
  doc.text(
    'Thank you for your business! For queries, contact us at the above details.',
    105,
    280,
    { align: 'center' }
  )

  doc.setFont('helvetica', 'normal')
  doc.text('Generated by M7 Distribution Platform', 105, 286, {
    align: 'center',
  })

  return doc
}

/**
 * Download invoice as PDF
 * @param data - Invoice data
 * @param filename - Optional custom filename
 */
export function downloadInvoice(data: InvoiceData, filename?: string): void {
  const doc = generateInvoice(data)
  const invoiceNumber = data.order.id.substring(0, 8).toUpperCase()
  const defaultFilename = `M7_Invoice_${invoiceNumber}_${data.customer.name.replace(/\s+/g, '_')}.pdf`
  doc.save(filename || defaultFilename)
}

/**
 * Preview invoice in new window
 * @param data - Invoice data
 */
export function previewInvoice(data: InvoiceData): void {
  const doc = generateInvoice(data)
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
