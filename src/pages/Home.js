import React, { Component } from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ToastAndroid,
  Button
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import api from "../services/api";

export default class Home extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    codigo: "",
    historicoBuscas: []
  };

  async componentDidMount() {
    const hist = await AsyncStorage.getItem("@RastreamentoAPP:historicoBuscas");
    if (hist !== null) {
      this.setState({ historicoBuscas: JSON.parse(hist) });
    }
  }

  handleCadastroItem = async () => {
    const { codigo } = this.state;

    if (!codigo.length) return;

    for (var i = 0; i < this.state.historicoBuscas.length; i++) {
      if (this.state.historicoBuscas[i].codigo == codigo) {
        ToastAndroid.show("Pacote já cadastrado.", ToastAndroid.SHORT);
        return;
      }
    }

    const response = await api.get(`pacote/${codigo}`);

    if (response.data === null) {
      ToastAndroid.show("Pacote não encontrado.", ToastAndroid.SHORT);
      return;
    }

    await this.setState({
      codigo: "",
      historicoBuscas: [...this.state.historicoBuscas, { codigo: codigo }]
    });

    await AsyncStorage.setItem(
      "@RastreamentoAPP:historicoBuscas",
      JSON.stringify(this.state.historicoBuscas)
    );

    this.showDetails(codigo);
  };

  handleInputChange = codigo => {
    this.setState({ codigo });
  };

  handleClickHistorico = item => {
    this.showDetails(item.codigo);
  };

  showDetails(codigo) {
    this.props.navigation.navigate("DetalhamentoPacote", {
      codigo: codigo,
      onDelete: this.onDelete
    });
  }

  onDelete = async codigo => {
    let historicoSalvo = this.state.historicoBuscas;
    for (var i = 0; i < historicoSalvo.length; i++) {
      if (historicoSalvo[i].codigo == codigo) {
        historicoSalvo.splice(i, 1);
      }
    }

    await this.setState({ historicoBuscas: historicoSalvo });

    await AsyncStorage.setItem(
      "@RastreamentoAPP:historicoBuscas",
      JSON.stringify(this.state.historicoBuscas)
    );

    ToastAndroid.show("Pacote (" + codigo + ") deletado!", ToastAndroid.SHORT);
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          marginTop: 5,
          marginBottom: 5,
          backgroundColor: "#DEDEDE"
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.containerGeral}>
        <View style={styles.content}>
          <Text style={styles.tituloApp}>Rastreamento</Text>
          <TextInput
            style={styles.input}
            placeholder="Código do pacote"
            value={this.state.codigo}
            onChangeText={this.handleInputChange}
            onSubmitEditing={this.handleCadastroItem}
            returnKeyType="send"
            autoCapitalize="characters"
            maxLength={10}
          />

          <TouchableOpacity
            onPress={this.handleCadastroItem}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Acompanhar Entrega</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lista}>
          {this.state.historicoBuscas.length > 0 && (
            <Text style={styles.titulo}>Histórico de Buscas</Text>
          )}
          <FlatList
            data={this.state.historicoBuscas}
            keyExtractor={historico => historico.codigo}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemLista}
                onPress={() => this.handleClickHistorico(item)}
              >
                <Text style={styles.textoItemLista}>{item.codigo}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerGeral: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  content: {
    alignItems: "center",
    padding: 20
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    height: 44,
    paddingHorizontal: 15,
    alignSelf: "stretch"
  },

  button: {
    height: 44,
    alignSelf: "stretch",
    marginTop: 10,
    backgroundColor: "#2276b1",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  },
  lista: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF"
  },
  itemLista: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#dedede",
    padding: 5,
    marginBottom: 5,
    backgroundColor: "#f9f9f9"
  },
  textoItemLista: {
    fontSize: 16,
    fontWeight: "bold"
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 30
  },
  tituloApp: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 20
  }
});
