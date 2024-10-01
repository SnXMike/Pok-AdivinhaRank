// ScoreScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ScoreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { score, wrongAttempts, playerName } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pontuação Final</Text>
      <Text style={styles.feedback}>Nome do Jogador: {playerName}</Text>
      <Text style={styles.feedback}>Pontuação: {score}</Text>
      <Text style={styles.feedback}>Tentativas Erradas: {wrongAttempts}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.replace('MainScreen'); // Voltar para a tela principal
          }}
        >
          <Text style={styles.buttonText}>Jogar Novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.replace('SplashScreen'); // Voltar para a tela inicial
          }}
        >
          <Text style={styles.buttonText}>Voltar à Tela Inicial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  feedback: {
    fontSize: 18,
    color: '#01579B',
    marginBottom: 16,
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
});

export default ScoreScreen;
