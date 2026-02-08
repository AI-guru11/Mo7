import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Order, Customer, Product } from './types'

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

export function generateInvoice(data: InvoiceData): jsPDF {
  const doc = new jsPDF()

  const companyInfo = data.companyInfo || {
    name: 'M7 Distribution',
    address: 'Azadpur Mandi, Delhi, India',
    phone: '+91-9876543210',
    gst: 'GST123456789',
  }

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('M7 DISTRIBUTION', 14, 20)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(companyInfo.address, 14, 27)
  doc.text(`Phone: ${companyInfo.phone}`, 14, 32)
  if (companyInfo.gst) {
    doc.text(`GST: ${companyInfo.gst}`, 14, 37)
  }

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 160, 20)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invoice #: ${data.order.id.substring(0, 8).toUpperCase()}`, 160, 27)
  doc.text(`Date: ${new Date(data.order.order_date).toLocaleDateString('en-IN')}`, 160, 32)

  doc.setLineWidth(0.5)
  doc.line(14, 42, 196, 42)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO:', 14, 50)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(data.customer.name, 14, 56)
  doc.text(data.customer.shop_name, 14, 61)
  doc.text(data.customer.phone, 14, 66)
  if (data.customer.location_geo) {
    doc.text(data.customer.location_geo, 14, 71)
  }

  const tableData = data.items.map((item) => [
    item.product.name,
    item.quantity_bags.toString(),
    `${item.quantity_kg.toFixed(2)} kg`,
    `₹${item.price_per_bag.toLocaleString('en-IN')}`,
    `₹${item.subtotal.toLocaleString('en-IN')}`,
  ])

  autoTable(doc, {
    startY: 80,
    head: [['PRODUCT', 'BAGS', 'WEIGHT', 'PRICE/BAG', 'AMOUNT']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 0, 0] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0] as [number, number, number],
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  })

  const finalY = (doc as any).lastAutoTable.finalY || 150

  doc.setLineWidth(0.5)
  doc.line(120, finalY + 10, 196, finalY + 10)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', 120, finalY + 20)
  doc.text(`₹${data.order.total_amount.toLocaleString('en-IN')}`, 196, finalY + 20, { align: 'right' })

  doc.setLineWidth(1)
  doc.line(120, finalY + 22, 196, finalY + 22)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const paymentType = data.order.payment_type.toUpperCase()
  doc.text(`Payment Type: ${paymentType}`, 14, finalY + 35)

  const statusText = data.order.is_paid ? 'PAID' : 'UNPAID'
  doc.setFont('helvetica', 'bold')
  doc.text(`Status: ${statusText}`, 14, finalY + 42)

  if (data.order.payment_type === 'credit' && !data.order.is_paid) {
    const dueDate = new Date(data.order.order_date)
    dueDate.setDate(dueDate.getDate() + 7)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`PAYMENT DUE: ${dueDate.toLocaleDateString('en-IN')}`, 14, finalY + 52)
  }

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('Thank you for your business!', 105, 280, { align: 'center' })
  doc.text('M7 Distribution Platform - Intelligent B2B Solutions', 105, 286, { align: 'center' })

  return doc
}

export function downloadInvoice(data: InvoiceData, filename?: string): void {
  const doc = generateInvoice(data)
  const invoiceNumber = data.order.id.substring(0, 8).toUpperCase()
  const defaultFilename = `M7_Invoice_${invoiceNumber}_${data.customer.name.replace(/\s+/g, '_')}.pdf`
  doc.save(filename || defaultFilename)
}

export function previewInvoice(data: InvoiceData): void {
  const doc = generateInvoice(data)
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
