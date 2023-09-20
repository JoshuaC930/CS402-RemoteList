import { TouchableOpacity, StyleSheet, Text, View, Modal, TextInput, Button, Platform, StatusBar, VirtualizedList } from "react-native";
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native";

//list object
const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity style={[styles.item, backgroundColor]} onPress={onPress}>
        <Text style={[styles.itemText, textColor]}>{item.key}</Text>
    </TouchableOpacity>
);

//modal obeject for add
const ModalInput = ({ onTextChange, onSubmit, visible, value, toggle }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            style={{ justifyContent: 'center' }}>
            <View style={{ height: 100, marginTop: 70, padding: 20, minHeight: 150, width: '80%', alignSelf: 'center', justifyContent: 'center', backgroundColor: '#b5b5b5', borderRadius: 20 }}>
                <Text style={{ alignSelf: "center", marginTop: 5, fontSize: 20 }}>Enter new item to add:</Text>
                <TextInput
                    style={{ fontSize: 20, padding: 5, marginTop: 10, marginBottom: 10, backgroundColor: 'white', borderRadius: 5 }}
                    value={value}
                    onChangeText={onTextChange}
                    placeholder={'Value'}
                />
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <Button title='Add' style={styles.button} textStyle={styles.buttonText} onPress={onSubmit}>Add</Button>
                    <Button title='Cancel' style={styles.button} textStyle={styles.buttonText} onPress={toggle}>Cancel</Button>
                </View>
            </View>
        </Modal>
    );
}

//list varable for names
var emptydata = [];

//main function
const VirtualList = () => {
    const [list, setList] = useState(emptydata);
    const [visible, setVisible] = useState(false);
    const [text, onTextChange] = useState('');

    //required functions for <VirtualList> component
    const getItemCount = (data) => list.length;
    const getItem = (data, index) => (list[index]);

    // Function for loading names into list
    async function load() {
        try {
            var url = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=joshuacorrales930";
        const response = await fetch(url);
        const names = await response.json();
        const newList = [];
        names.forEach((item) => {
            newList.push(item);
        });
  
        setList(newList);
        alert("Loaded data from server!");

        } catch (error) {
            alert("Nothing to load!");
        }
    }
  
    // Load data when app starts
    useEffect(() => {
        load();
    }, []);
  

    async function save() {
        var url = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=joshuacorrales930";
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(list)
        };

        await fetch(url, requestOptions);
        alert("Saved data to server!");
    }

    const renderItem = ({ item }) => {
        var backgroundColor, color;

        backgroundColor = item.selected ? '#349eeb' : 'white';
        color = item.selected ? 'white' : 'black';

        return (<Item
            item={item}
            onPress={() => { toggleList(item.key) }}
            backgroundColor={{ backgroundColor }}
            textColor={{ color }}
        />)

        // called when a list item is touched
        function toggleList(key) {
            const newList = list.map((item) => {
                if (item.key == key) item.selected = item.selected ? false : true;
                return item;
            });

            setList([...newList]);
        }

    }

    //function for adding name to list
    const add = (value) => {
        if (value == "") {
            alert("Please enter a value.");
        }
        else {
            const newList = list.concat({ key: value, selected: false });
            setList([...newList]);
        }
    }

    //function for removing item from list
    function remove() {
        const deletedList = list.filter((item) => item.selected == true);
        const newList = list.filter((item) => item.selected != true);

        if (deletedList.length == 0) {
            alert("No item was selected. No items were removed from list.");
        }
        else {
            var deletedItemsString = "";
            for (var i = 0; i < deletedList.length; i++) {
                deletedItemsString += "- " + deletedList[i].key + "\n"
            }
            alert("Deleted item(s): \n" + deletedItemsString);
        }

        setList([...newList]);
    }

    //function for joining entries
    function join() {
        var joinedString = "";
        const newList = list.filter((item) => item.selected != true);
        const joinedList = list.filter((item) => item.selected == true);

        if (joinedList.length == 0) {
            alert("No items were selected!");
            return;
        }

        joinedList.forEach((item) => joinedString += item.key + ",");
        const newJoinedList = newList.concat({ key: joinedString.substring(0, joinedString.length - 1), selected: false });

        setList([...newJoinedList]);
    }

    function split() {
        const selectedList = list.filter((item) => item.selected == true);

        if (selectedList.length == 0) {
            alert("No items were selected!");
            return;
        }

        var newList = list;

        selectedList.forEach((selectedItem) => {
            if (selectedItem.key.includes(",") && !selectedItem.key.startsWith(",") && !selectedItem.key.endsWith(",")) {
                newList = newList.filter((item) => { return item != selectedItem })
                var splitArr = selectedItem.key.split(",")
                splitArr.forEach((value) => newList = newList.concat({ key: value, selected: false }))
                setList(newList)
            }
            else {
                const uncheckedList = list.map((item) => {
                    if (item.selected && selectedItem.key == item.key) item.selected = false
                    return item;
                })

                setList([...uncheckedList])
            }
        })
    }

    

    return (
        <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20 }]}>
            <View>
                <Text style={styles.title}>A Remote List</Text>
                <Text style={styles.instruction}>Use the the buttons below to modify the list.</Text>
            </View>
            <View>
                <View style={styles.buttonLayout}>
                    <Button style={styles.button} title='Add' onPress={() => setVisible(!visible)} />
                    <Button style={styles.button} title='Remove' onPress={() => remove()} />
                    <Button title='Join' onPress={() => join()} />
                    <Button title='Split' onPress={() => split()} />
                    <Button title='Load' onPress={() => load()} />
                    <Button title='Save' onPress={() => save()} />
                </View>
            </View>
            <ModalInput
                visible={visible}
                value={text}
                onTextChange={onTextChange}
                toggle={() => setVisible(!visible)}
                onSubmit={() => { onTextChange(''); add(text); setVisible(!visible) }}
            />
            {/* <ScrollView style={styles.list}>
                
            </ScrollView> */}
            <VirtualizedList 
                    data={emptydata}
                    initialNumToRender={4}
                    renderItem={renderItem}
                    keyExtractor={(item,index) => index}
                    getItemCount={getItemCount}
                    getItem={getItem}
                />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        paddingLeft: 20
    },
    instruction: {
        fontSize: 20,
        paddingLeft: 20,
        paddingTop: 3,
        paddingBottom: 5
    },
    buttonLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        margin: 20,
    },
    list: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'gray',
    },
    item: {
        paddingLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: 'gray',
        overflow: 'hidden'
    },
    itemText: {
        fontSize: 24
    }
})

export default VirtualList;