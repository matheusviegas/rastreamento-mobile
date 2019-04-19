import React, { Component } from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage
} from "react-native";

export default class App extends Component {
  state = {
    codigo: "",
    historicoBuscas: []
  };

  handleLogin = async () => {
    const { codigo } = this.state;

    if (!codigo.length) return;

   // await AsyncStorage.setItem("@RastreamentoAPP:codigo", username);

    this.props.navigation.navigate("DetalhamentoPacote");
  };

  handleInputChange = codigo => {
    this.setState({ codigo });
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Código do pacote"
            value={this.state.codigo}
            onChangeText={this.handleInputChange}
            onSubmitEditing={this.handleLogin}
            returnKeyType="send"
          />

          <TouchableOpacity onPress={this.handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Acompanhar Entrega</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  content: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    padding: 30
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    height: 44,
    paddingHorizontal: 15,
    alignSelf: "stretch"
    //marginTop: 30
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
  }
});
