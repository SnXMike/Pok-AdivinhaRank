import React, { useReducer, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ROUNDS = 5;

// Estado inicial
const initialState = {
  score: 0,
  wrongAttempts: 0,
  round: 0,
  gameOver: false,
};

// Redutor
const reducer = (state, action) => {
  switch (action.type) {
    case 'CORRECT_ANSWER':
      return { ...state, score: state.score + 1 };
    case 'WRONG_ANSWER':
      return { ...state, wrongAttempts: state.wrongAttempts + 1 };
    case 'NEXT_ROUND':
      return { ...state, round: state.round + 1 };
    case 'RESET_GAME':
      return initialState;
    case 'END_GAME':
      return { ...state, gameOver: true };
    default:
      return state;
  }
};

const MainScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName } = route.params; 
  const [state, dispatch] = useReducer(reducer, initialState);
  const { score, wrongAttempts, round, gameOver } = state;
  const [pokemon, setPokemon] = useState({});
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    fetchNewPokemon();
    fetchRankings(); // Fetch rankings when the component mounts
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchNewPokemon = async () => {
    try {
      const allPokemons = await fetchPokemonList();
      const randomIndex = Math.floor(Math.random() * allPokemons.length);
      const correctPokemon = allPokemons[randomIndex];
      const response = await fetch(correctPokemon.url);
      const data = await response.json();
      setPokemon(data);

      const optionsList = [correctPokemon];
      while (optionsList.length < 4) {
        const randomIndex = Math.floor(Math.random() * allPokemons.length);
        const randomPokemon = allPokemons[randomIndex];
        if (!optionsList.some(p => p.name === randomPokemon.name)) {
          optionsList.push(randomPokemon);
        }
      }

      setOptions(optionsList.sort(() => Math.random() - 0.5));
      setFeedback('');
      setWaiting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/ranking');
      if (!response.ok) {
        console.error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setRankings(data);
    } catch (error) {
      console.error('Erro ao buscar rankings:', error.message);
    }
  };
  
  const handleFeedbackTimeout = () => {
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        dispatch({ type: 'END_GAME' });
        saveScore();
      } else {
        dispatch({ type: 'NEXT_ROUND' });
        fetchNewPokemon();
      }
    }, 3000);
  };

  const checkGuess = (chosenPokemon) => {
    if (waiting) return;

    setWaiting(true);

    if (chosenPokemon.name === pokemon.name) {
      setFeedback(`Correto! ${chosenPokemon.name.charAt(0).toUpperCase() + chosenPokemon.name.slice(1)} é o Pokémon certo.`);
      dispatch({ type: 'CORRECT_ANSWER' });
    } else {
      setFeedback(`Incorreto! O Pokémon correto era ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}. Tente novamente!`);
      dispatch({ type: 'WRONG_ANSWER' });
    }

    handleFeedbackTimeout();
  };

  const saveScore = async () => {
    const finalScore = Math.max(0, ROUNDS - wrongAttempts);
    if (!userName || typeof finalScore !== 'number') {
      console.error('Dados inválidos para salvar a pontuação.');
      return;
    }
  
    try {
      const response = await fetch('http://10.0.2.2:3000/ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: userName, pontuacao: finalScore }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na requisição: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
      }
  
      // Aqui, busque os rankings novamente
      await fetchRankings(); // Chame a função para buscar rankings após salvar
  
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error.message);
    }
  };
  
  if (gameOver) {
    const finalScore = Math.max(0, ROUNDS - wrongAttempts);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Jogo Finalizado!</Text>
        <Text style={styles.feedback}>Pontuação Final: {finalScore}</Text>
        <Text style={styles.feedback}>Tentativas Erradas: {wrongAttempts}</Text>

        {/* Tabela de Rankings */}
        <Text style={styles.title}>Ranking</Text>
        <View style={styles.rankContainer}>
        <FlatList
        data={rankings}
        keyExtractor={(item) => item.nome}
        renderItem={({ item, index }) => (
        <View style={styles.rankRow}>
        <Text style={styles.rankText}>{index + 1}. {item.nome}</Text>
        <Text style={styles.rankScore}>{item.pontuacao}</Text>
      </View>
    )}
  />
</View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => dispatch({ type: 'RESET_GAME' })}>
            <Text style={styles.buttonText}>Jogar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SplashScreen')}>
            <Text style={styles.buttonText}>Voltar à Tela Inicial</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adivinhe o Pokémon</Text>
      <Image source={{ uri: pokemon.sprites?.front_default }} style={styles.image} />
      <Text style={styles.feedback}>Escolha o Pokémon:</Text>
      {options.map((option) => (
        <TouchableOpacity key={option.name} style={styles.optionButton} onPress={() => checkGuess(option)}>
          <Text style={styles.optionText}>{option.name}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.feedback}>{feedback}</Text>
      <Text style={styles.score}>Pontuação: {score}</Text>
      <Text style={styles.wrongAttempts}>Tentativas Erradas: {wrongAttempts}</Text>
      <Text style={styles.round}>Rodada: {round + 1} / {ROUNDS}</Text>
    </View>
  );
};

// Estilos...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288D1',
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FF9800',
    marginBottom: 16,
  },
  feedback: {
    fontSize: 18,
    color: '#01579B',
    marginBottom: 16,
  },
  score: {
    fontSize: 18,
    color: '#0288D1',
    marginTop: 16,
  },
  wrongAttempts: {
    fontSize: 18,
    color: '#D32F2F',
    marginTop: 8,
  },
  round: {
    fontSize: 18,
    color: '#0288D1',
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0288D1',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9800', // Cor mais vibrante para o título
    marginBottom: 16,
    textAlign: 'center', // Centralizar
  },
  
  rankContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
  },
  rankText: {
    fontSize: 18,
    color: '#0288D1',
    fontWeight: 'bold',
  },
  rankScore: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});

export default MainScreen;
