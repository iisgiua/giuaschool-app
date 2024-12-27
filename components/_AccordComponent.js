import * as React from 'react';
import { View, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import Pressable from './PressableComponent';
import Styles from './Styles';


// inizializzazione
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


export default ({...props}) => {
  // definizione dello stato
  const [expanded, setExpanded] = React.useState(false);

  // gestione dell'espansione/compressione
  const handleExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  };

  // mostra componente
  return (
    <View>
      <Pressable style={[Styles.accordRow, {backgroundColor: expanded ? '#888888' : '#0066cc'}]}
        onPress={handleExpansion}
      >
        <Text style={Styles.accordTitle}>{props.title}</Text>
        <Icon style={Styles.accordIcon}
          name={expanded ? 'chevron-up' : 'chevron-down'}
        />
      </Pressable>
      <View style={Styles.accordHr} />
      { expanded &&
        <View style={Styles.accordText}>
          <Text style={Styles.accordContent}>{props.text}</Text>
        </View>
      }
    </View>
  );
};
