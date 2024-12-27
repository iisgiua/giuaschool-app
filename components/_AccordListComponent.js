import Accord from './AccordComponent';


export default ({...props}) => {

  // mostra componente
  let items = [];
  for (item of props.list) {
    items.push(
      <Accord
        key = {item.title}
        title = {item.title}
        text = {item.text}
      />
    );
  }
  return items;
};
