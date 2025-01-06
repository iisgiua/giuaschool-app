import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { styles } from "./_layout";


// **
// * Pagina iniziale dell'app
// *
// * @author Antonello Dessì
// *
export default function HomeScreen() {

  // visualizza pagina
  return (
    <View style={styles.pageContainer}>
      <Stack.Screen
        options={{
          title: 'Pagina iniziale',
        }}
      />
      <Link href="/login">login</Link>
      <Link href="/settings">impostazioni</Link>
      <Link href="/connect">associa</Link>
      <Link href="/about">info</Link>
    </View>
  );
}
