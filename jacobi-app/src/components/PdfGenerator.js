// PdfGenerator.js
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2'; // Importando SweetAlert2

const PdfGenerator = ({ results }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Aumentando a posição do título
    doc.text('Resultados do Método de Gauss-Jacobi', 14, 30); // Aumenta a posição Y do título

    // Definindo o tamanho da fonte e a altura da linha
    doc.autoTable({
      head: [['Iteração', 'Resultados']],
      body: results.map((result, index) => [
        `${index + 1}`,
        result.map(val => val.toFixed(8)).join(' | ') // Exibindo em 8 casas decimais
      ]),
      startY: 40, // Começando a tabela mais abaixo para evitar sobreposição com o título
      styles: {
        fontSize: 11, // Aumenta o tamanho da fonte (por exemplo, de 10 para 11)
        cellPadding: 3, // Aumenta o preenchimento dentro das células
      },
      headStyles: {
        fontSize: 14, // Tamanho da fonte do cabeçalho
      },
      margin: { top: 30 }, // Margem superior do PDF
    });

    doc.save('resultados_gauss_jacobi.pdf');

    // Exibindo o SweetAlert2 após a geração do PDF
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'O PDF foi gerado com sucesso!',
      confirmButtonText: 'OK',
      customClass: {
        icon: 'my-icon-class',         // Classe para o ícone
        popup: 'my-popup-class',       // Classe para a caixa de diálogo
        title: 'my-title-class',       // Classe para o título
        content: 'my-content-class',   // Classe para o conteúdo
        confirmButton: 'my-button-class' // Classe para o botão de confirmação
      },
    });
  };

  return (
    <button onClick={generatePDF}>Imprimir Resultados</button>
  );
};

export default PdfGenerator;
