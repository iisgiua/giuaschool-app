/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Pressable } from 'react-native';


// **
// * Componente per visualizzare i pulsanti
// *
// * @author Antonello Dessì
// *
export default function PressableComponent({ children, ...props }) {

  // mostra componente
  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={props.hitSlop}
      disabled={props.disabled}
      style={({ pressed }) => [props.style || {}, { opacity: pressed ? 0.5 : 1 }]}
    >{children}</Pressable>
  );
}
