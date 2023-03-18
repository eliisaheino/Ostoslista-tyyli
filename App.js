import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Keyboard, Asyn } from 'react-native';
import { Header, Icon, Input, Button, ListItem } from '@rneui/base';
import * as SQLite from 'expo-sqlite';



export default function App() {
 //Tilamuuttujat syöttökenttien hallintaan ja tietokantahakua varten
 const [product, setProduct] = useState('');
 const [amount, setAmount] = useState('');
 const [list, setList] = useState([]);

//Tietokantakahva
const db = SQLite.openDatabase('shoppinglistdb.db')


 //Tietokannan luominen
 useEffect( () => {
  db.transaction(tx => {
    tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, product text, amount text);');
  },
  null,   //Virheenkäsittely
  updateList  //updateList funktio päivittää Flatlist-komponenttia
  ); 
 }, [] );

 //Kun buttonia painetaan tehdään saveItem
 const saveItem = () => {
  console.log('SaveItem:' , product, amount)
  db.transaction(
    tx =>{
    tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);', [product, amount]);
  },
  null,
  updateList
  )
 }

 //Tiedon hakemista varten
 const updateList = () => {
  console.log('updateList');
  db.transaction(
    tx => {
    tx.executeSql('select * from shoppinglist;', [], (_, { rows }) => {
    setList(rows._array);
    setProduct('');
    setAmount('');
    Keyboard.dismiss();
    });
  });
 }

 //Tiedon poistaminen
 const deleteItem = (id) => {
  db.transaction(
    tx => {
      tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
    },
    null,
    updateList
  )
 }

 
  return (
    <View style={styles.container}>

      <Header
        leftComponent= {{ icon: 'menu' , color: '#fff'}}
        centerComponent= {{ text: 'SHOPPING LIST' , style:{color: '#fff'}}}
      />

    {/*Syöttökenttä ostosten kirjoittamiseen*/}
    {/*onChange antaa muuttujalle sisällön */}
    <View >
      <Input
      placeholder='product' label='PRODUCT'
      onChangeText={product => setProduct(product)}
      value={product}
      />
       <Input
      placeholder='amount' label='AMOUNT'
      onChangeText={amount => setAmount(amount)}
      value={amount}
      />
     </View>  

    {/*Painikkeet ja funktiokutsut */} 
    <View>
    <Button
    raised icon={{name:'save'}} onPress={saveItem}
    title="SAVE"
    />
    </View> 


    {/*ListItem ja FlatList listan näyttämiseen */}
    <FlatList
    keyExtractor = {(item) => String(item.id)}
    style ={{ marginLeft: "5%"}}
    data={list}
    renderItem= {({item}) =>  
    
      <ListItem bottomDivider>
        <ListItem.Content
        style = {styles.listcontainer}>
          <ListItem.Title><Text style={{fontSize: 16}}> {`${item.product}`}</Text></ListItem.Title>
          <ListItem.Subtitle><Text style={{fontSize: 16}}> {`${item.amount}`}</Text></ListItem.Subtitle>
          <Icon type='material'name='delete'onPress= { () => deleteItem(item.id)} />
        </ListItem.Content>
      </ListItem> 
      
    }
    ></FlatList>
        </View>
  );
}
  


const styles = StyleSheet.create({
  container: {
    marginTop:40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
  });
