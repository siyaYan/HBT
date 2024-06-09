
<ScrollView>
{/* <Text>{roundData.data.length}</Text> */}
{roundData.data.map((round, index) => (
   <View key={round._id} style={{ margin: 10 }}>
    <Button
      // onPress={()=>navigation.navigate('RoundConfig')}
      key={index}
      title={"Round ${index+1}"}
      onPress={() => {
        // console.log("Roundinfo on homepage:", round),
          handleRoundPress(round);
      }}
      // onPress={() => {handleRoundPress(round)}}
      rounded="30"
      // shadow="1"
      mt="5"
      width="80%"
      size="lg"
      style={{
        borderWidth: 1, // This sets the width of the border
        borderColor: "#49a579", // This sets the color of the border
      }}
      backgroundColor={"rgba(250,250,250,0.2)"}
      _text={{
        color: "#191919",
        fontFamily: "Regular Semi Bold",
        fontSize: "lg",
      }}
      _pressed={{
        // below props will only be applied on button is pressed
        bg: "#e5f5e5",
        // _text: {
        //   color: "warmGray.50",
        // },
      }}
    >
      {round.name}
    </Button>
    {/* <Text>Level: {round.level}</Text>
    <Text>Start Date: {round.startDate}</Text>
    <Text>Max Capacity: {round.maxCapacity}</Text>
    <Text>Allow Others: {round.allowOthers ? "Yes" : "No"}</Text>
    <Text>Status:{round.status}</Text> */}
  </View> 
))}  
</ScrollView>
