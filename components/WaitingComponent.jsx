/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from '../app/_layout';


// **
// * Componente per indicare l'attesa del completamento di una procedura
// *
// * @author Antonello Dessì
// *
export default function WaitingComponent() {

  // mostra componente
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator
        color='#0000ff'
        size='large'
      />
      <Text style={styles.text}>Attendi...</Text>
    </View>
  );
}
