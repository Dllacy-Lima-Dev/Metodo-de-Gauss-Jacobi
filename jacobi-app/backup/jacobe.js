import React, { useState } from 'react';
import PdfGenerator from './components/PdfGenerator';
import Swal from 'sweetalert2';
import './App.css';
import './alert.css';

function App() {
  const [matrixSize, setMatrixSize] = useState(3); // Estado para o tamanho da matriz (não utilizado no código fornecido)
  const [tolerance, setTolerance] = useState(0.01); // Estado para a tolerância de erro
  const [maxIter, setMaxIter] = useState(50); // Estado para o número máximo de iterações
  const [matrix, setMatrix] = useState([]); // Estado para a matriz A do sistema linear
  const [vectorB, setVectorB] = useState([]); // Estado para o vetor b do sistema linear
  const [solution, setSolution] = useState([]); // Estado para a solução do sistema linear
  const [iterations, setIterations] = useState(0); // Estado para o número de iterações realizadas
  const [initialGuess, setInitialGuess] = useState(''); // Estado para o chute inicial
  const [iterationResults, setIterationResults] = useState([]); // Estado para armazenar os resultados de cada iteração

  // Função para lidar com a mudança de valores na matriz A
  const handleMatrixChange = (i, j, value) => {
    const newMatrix = [...matrix];
    if (!newMatrix[i]) {
      newMatrix[i] = [];
    }
    newMatrix[i][j] = parseFloat(value);
    setMatrix(newMatrix);
  };

  // Função para lidar com a mudança de valores no vetor b
  const handleVectorChange = (i, value) => {
    const newVector = [...vectorB];
    newVector[i] = parseFloat(value);
    setVectorB(newVector);
  };

  // Função para lidar com o envio do formulário (submissão do método de Gauss-Jacobi)
  const handleSubmit = (event) => {
    event.preventDefault();

    // Lógica do Método de Gauss-Jacobi
    const result = gaussJacobiMethod(matrix, vectorB, tolerance, maxIter, initialGuess);

    // Atualiza os estados com os resultados obtidos
    setSolution(result.solution); // solução
    setIterations(result.iterations); // quantidade de iteração
    setIterationResults(result.iterationResults); // resultados das iterações
  };

  // Função que implementa o Método de Gauss-Jacobi
  const gaussJacobiMethod = (A, b, tol, maxIter, initialGuess) => {
    // Usa o chute inicial se fornecido, caso contrário, preenche com 0
    let x = initialGuess ? initialGuess.split(' ').map(Number) : new Array(b.length).fill(0);
    let iterations = 0;
    let error = tol + 1;
    const allIterations = []; // Para armazenar todos os resultados das iterações

    // Loop principal do método
    while (error > tol && iterations < maxIter) {
      const xNew = [...x];
      // Iteração sobre cada equação do sistema
      for (let i = 0; i < A.length; i++) {
        let sum = b[i];
        // Calcula a nova estimativa para x[i]
        for (let j = 0; j < A.length; j++) {
          if (i !== j) {
            sum -= A[i][j] * x[j];
          }
        }
        xNew[i] = sum / A[i][i]; // Atualiza a estimativa para x[i]
      }

      // Fazendo uma cópia de x antes do cálculo do erro
      const previousX = [...x];

      // Cálculo do erro absoluto
      error = Math.max(...xNew.map((xi, idx) => Math.abs(xi - previousX[idx])));
      x = xNew; // Atualiza x com os novos valores calculados
      iterations++; // Incrementa o número de iterações realizadas

      allIterations.push([...x]); // Armazena os resultados de cada iteração para visualização
    }

    // Verifica se o método convergiu
    if (error > tol) {
      Swal.fire({
        icon: 'info',
        title: 'Convergência não alcançada!',
        text: 'O método de Gauss-Jacobi não convergiu dentro do número máximo de iterações.',
        customClass: {
          icon: 'my-icon-class',
          popup: 'my-popup-class',
          title: 'my-title-class',
          content: 'my-content-class',
          confirmButton: 'my-button-class'
        },
      });
    }

    // Retorna a solução encontrada, o número de iterações e os resultados de todas as iterações
    return { solution: x, iterations, iterationResults: allIterations };
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Método de Gauss-Jacobi</h1>
      </header>
      <main className="App-main">
        <form className='App-form' onSubmit={handleSubmit}>
          <div className='App-size-matriz'>
            <label className='App-size-matriz-label'>
              Tamanho da Matriz
            </label>
            <div className='App-size-matriz-numer'>
              <input
                type="number"
                value={matrixSize}
                onChange={(e) => setMatrixSize(parseInt(e.target.value) || 2)}
              />
            </div>
          </div>

          <div className='App-sub-header'>
            <h2 className='App-title-h2'>Matriz A</h2>
          </div>
          {Array.from({ length: matrixSize }).map((_, i) => (
            <div key={i} className="matrix-row">
              {Array.from({ length: matrixSize }).map((_, j) => (
                <input
                  key={`${i}-${j}`}
                  type="text"
                  onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                  placeholder={`A[${i + 1}][${j + 1}]`}
                  className="matrix-input"
                />
              ))}
            </div>
          ))}

          <h2 className='App-title-h2'>Vetor b</h2>
          <div className="vector-container">
            {Array.from({ length: matrixSize }).map((_, i) => (
              <input
                key={i}
                type="text"
                onChange={(e) => handleVectorChange(i, e.target.value)}
                placeholder={`b[${i + 1}]`}
                className="vector-input"
              />
            ))}
          </div>

          <div className="input-row">
            <div className="input-column">
              <label className='App-label'>Chute Inicial (opcional):</label>
              <input
                type="text"
                value={initialGuess}
                onChange={(e) => setInitialGuess(e.target.value)}
                placeholder="ex: 1 1 1"
              />
            </div>
            <div className="input-column">
              <label className='App-label'>Tolerância:</label>
              <input
                type="number"
                step="0.01"
                value={tolerance}
                onChange={(e) => setTolerance(parseFloat(e.target.value))}
              />
            </div>
            <div className="input-column">
              <label className='App-label'>N Máx de Iterações:</label>
              <input
                type="number"
                value={maxIter}
                onChange={(e) => setMaxIter(parseInt(e.target.value) || 100)}
              />
            </div>
          </div>
          <div className="button-container">
            <button type="button" onClick={() => window.location.reload()}>Limpar</button>
            <button type="submit">Calcular</button>
          </div>
        </form>

        {solution.length > 0 && (
          <div className="resultado-container">
            <h2 className="titulo-resultado">Solução Aproximada</h2>
            <p className="solucao">
              {solution.map((val, idx) => (
                <span key={idx}>
                  x<sub>{idx + 1}</sub> = {val.toFixed(4)}
                  {idx < solution.length - 1 && ', '}
                </span>
              ))}
            </p>
            <p className="iteracoes">Quantidade de Iterações: {iterations}</p>
            <PdfGenerator results={iterationResults} /> {/* Componente para gerar PDF */}
          </div>
        )}

      </main>

      <footer className="App-footer">
        <p>Álgebra Linear - BSI UFRA | 2023</p>
      </footer>

    </div>
  );
}

export default App;
