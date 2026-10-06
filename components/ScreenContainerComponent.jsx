/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/AppStyles';


// **
// * Componente per lo schermo intero, con scrollbar e senza sovrapposizione con la NavigationBar
// *
// * @author Antonello Dessì
// *
export default function ScreenContainer({ children, style }) {

  // mostra componente
  return (
    <SafeAreaView style={[styles.pageContainer, style, { flex: 1 }]}
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
