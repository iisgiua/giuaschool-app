import { Stack } from 'expo-router';
import { Link } from "expo-router";
import { View, Text } from "react-native";
import { styles } from "./_layout"; // Import degli stili condivisi

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Questo è altro',
        }}
      />
      <Text style={styles.title}>Questa è la schermata dei Dettagli!</Text>
      <Link href="/" style={styles.link}>
        Torna alla Home
      </Link>
    </View>
  );
}

// export const config = {
//   headerTitle: "Dettagli", // Titolo per questa schermata
// };
