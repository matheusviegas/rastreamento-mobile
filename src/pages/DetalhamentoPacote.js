import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";

import api from "../services/api";

export default class DetalhamentoPacote extends Component {
  state = {
    pacote: null,
    isFetching: false
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("codigo", "Detalhamento"),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          const codigoPacote = navigation.getParam("codigo", null);
          Alert.alert(
            "Confirmação",
            "Tem certeza que deseja apagar o pacote (" + codigoPacote + ")?",
            [
              {
                text: "Sim",
                onPress: () => {
                  navigation.goBack();
                  navigation.state.params.onDelete(codigoPacote);
                }
              },
              {
                text: "Não",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              }
            ],
            { cancelable: false }
          );
        }}
      >
        <Icon
          style={{ marginRight: 20 }}
          name="delete"
          size={24}
          color="#dc3545"
        />
      </TouchableOpacity>
    )
  });

  async componentDidMount() {
    this.buscaDadosPacote();
  }

  async buscaDadosPacote() {
    const codigoPacote = this.props.navigation.getParam("codigo", null);
    if (codigoPacote !== null) {
      const response = await api.get(`pacote/${codigoPacote}`);

      if (response.data === null) {
        alert("Pacote nao encontrado!");
        return;
      }

      this.setState({
        pacote: response.data,
        isFetching: false
      });
    }
  }

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

  onRefresh = async () => {
    this.setState({ isFetching: true });
    this.buscaDadosPacote();
  };

  render() {
    return (
      <View style={styles.lista}>
        {this.state.pacote == null && (
          <Text style={styles.carregando}>Carregando..</Text>
        )}
        {this.state.pacote != null && (
          <FlatList
            data={this.state.pacote.atualizacoes}
            keyExtractor={atualizacao => atualizacao._id}
            ItemSeparatorComponent={this.renderSeparator}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            renderItem={({ item }) => (
              <View style={styles.itemLista}>
                <View style={styles.cabecalho}>
                  <Text style={styles.local}>{item.local}</Text>
                  <Text style={styles.dataAtualizacao}>
                    há{" "}
                    {distanceInWords(item.createdAt, new Date(), {
                      locale: pt
                    })}
                  </Text>
                </View>

                <Text>{item.tipo}</Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF"
  },
  separador: {
    height: 1,
    color: "#dedede"
  },
  itemLista: {
    flex: 1
  },
  cabecalho: {
    flex: 1,
    flexDirection: "row"
  },
  dataAtualizacao: {
    flex: 1,
    textAlign: "right"
  },
  local: {
    fontWeight: "bold"
  },
  carregando: {
    textAlign: "center"
  }
});
