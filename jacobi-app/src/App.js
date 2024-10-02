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
    // Se o usuário forneceu um chute inicial (initialGuess), ele é dividido em um array de números (com .split() e .map(Number)).
    let x = initialGuess ? initialGuess.split(' ').map(Number) : new Array(b.length).fill(0);

    // Inicializa o contador de iterações em 0, que será usado para controlar o número de iterações feitas
    let iterations = 0;

    // Define um valor inicial de erro, que será maior que a tolerância inicialmente para garantir que o loop seja executado ao menos uma vez.
    // Aqui, tol + 1 garante que o erro inicial seja maior que a tolerância.
    let error = tol + 1;

    // Array para armazenar as soluções (valores de x) de cada iteração.
    // Isso é útil para visualizar o progresso das iterações.
    const allIterations = [];

    // Loop principal do método de Gauss-Jacobi.
    // O loop continua enquanto o erro for maior que a tolerância (tol) e o número de iterações for menor que o máximo permitido (maxIter).
    while (error > tol && iterations < maxIter) {
      // Cria uma nova estimativa para os valores de x. 
      // Isso evita modificar o array original (x) enquanto calculamos novos valores.
      const xNew = [...x];

      // Iteração sobre cada equação (linha) do sistema A * x = b.
      // Para cada equação, calculamos o valor correspondente de x[i].
      for (let i = 0; i < A.length; i++) {
        let sum = b[i]; // Começa com o valor de b[i] (o termo independente da equação).

        // Para cada elemento da linha A[i], exceto A[i][i], subtrai A[i][j] * x[j] da soma.
        // Isso reflete o cálculo da soma dos produtos dos elementos da matriz A com as estimativas atuais de x.
        for (let j = 0; j < A.length; j++) {
          if (i !== j) { // Ignora o termo diagonal A[i][i], pois ele será usado depois para dividir.
            sum -= A[i][j] * x[j]; // Subtrai A[i][j] * x[j] de sum.
          }
        }

        // Calcula a nova estimativa para x[i] dividindo a soma por A[i][i] (o termo da diagonal).
        xNew[i] = sum / A[i][i]; // Atualiza xNew[i] com a nova estimativa.
      }

      // Faz uma cópia dos valores anteriores de x antes de atualizar, para calcular o erro na próxima etapa.
      const previousX = [...x];

      // Cálculo do erro absoluto. 
      // O erro é definido como o maior valor da diferença entre as estimativas novas e antigas de x.
      // Isso nos dá uma medida de quanto as soluções estão mudando a cada iteração.
      error = Math.max(...xNew.map((xi, idx) => Math.abs(xi - previousX[idx])));

      // Atualiza x com os novos valores calculados (xNew) para serem usados na próxima iteração.
      x = xNew;

      // Incrementa o contador de iterações.
      iterations++;

      // Armazena os resultados de cada iteração para fins de visualização ou análise posterior.
      // Cada iteração registra os valores de x naquele ponto do cálculo.
      allIterations.push([...x]);
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
