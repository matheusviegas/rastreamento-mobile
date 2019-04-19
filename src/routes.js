import {
    createSwitchNavigator,
    createStackNavigator,
    createAppContainer
  } from "react-navigation";
  
  import Home from "./pages/Home";
  import DetalhamentoPacote from "./pages/DetalhamentoPacote";
  
  const Routes = createAppContainer(
    createStackNavigator({
        Home,
        DetalhamentoPacote
      })
  );
  
  export default Routes;