import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  FlatList,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
let movieList =[];
type Props = {};
export default class App extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {
     movieList:[],
     loaded:false,
     allLoaded:false,
     curPage:1,
     viewNumber:2,
    }
    this.fetchData  = this.fetchData.bind(this);
  }
  componentDidMount(){
    this.fetchData();
  }
  fetchData(){
    fetch('https://live.51vv.com/act/bead/rankList?giftID=2000109&curPage='+ this.state.curPage + '&viewNumber='+ this.state.viewNumber,{
    mode:'cors',
    }).then((res) => res.json())
    .then((res) => {
        this.setState({
            movieList:this.state.movieList.concat(res.info.reportList),
            loaded:true,
            curPage:this.state.curPage + 1,
        })
        if(res.info.reportList.length < this.state.viewNumber){
            //已加载全部
             this.setState({
                allLoaded:true,
            })
        }else{
             this.setState({
                allLoaded:false,
             })
        }
    })
  }
  render() {
    if(!this.state.loaded){
        return this.renderLoadingView();
    }
    //渲染列表
    return (
        <FlatList
        data = { this.state.movieList }
        renderItem = { this.renderList }
        style = { styles.list }
        onEndReached = { this._onEndReached.bind(this)}
        ></FlatList>
    );
  }
  //加载中...
  renderLoadingView(){
    return (
        <View>
            <Text>正在加载中...</Text>
        </View>
    )
  }
  //渲染列表
  renderList(data){
   return(
    <View style={styles.item}>
        <Image source={{uri: data.item.userImg}}
           style={{width: 90, height: 90}} />
        <View style={styles.desc}>
            <Text style={styles.title } ellipsizeMode='tail' numberOfLines={ 1 } >{data.item.nickName}</Text>
            <Text style = { styles.userid }>{data.item.userID}</Text>
        </View>
    </View>
   )
  }
  //滑动到底部
  _onEndReached(){
    if(this.state.allLoaded) return;
    this.fetchData();
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#fff',
    marginBottom:20,
  },
  desc:{
    flex:1,
    textAlign:'left',
    paddingLeft:15

  },
   title:{
        fontSize:20,
        textAlign:'left',
        marginBottom:8,
        overflow:'hidden',

   },
   userid:{
        fontSize:20,
        textAlign:'left',
   },
   list:{
        paddingTop:20,
        backgroundColor:'#fff',
   }

});
