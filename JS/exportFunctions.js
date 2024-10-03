import jsPDF from "jspdf";

exportButton.addEventListener("click", () => {
  const doc = new jsPDF();
  doc.text(input.value, 10, 10);
  doc.save("exported-text.pdf");
});
