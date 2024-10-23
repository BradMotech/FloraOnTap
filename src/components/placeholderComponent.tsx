import { Image, Text } from "react-native";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";

interface PlaceholderComponentProps {
    text:string
}

const PlaceholderComponent = ({text}: PlaceholderComponentProps) => {
  return (
    <>
    <Text style={[globalStyles.textAlignCenter,globalStyles.GorditaRegular,{fontSize:tokens.fontSize.medium,color:tokens.colors.barkInspiredDescriptionTextColor}]}>{text}</Text>
    {/* <Image style={{width:'100%',height:250}} source={{uri:'https://firebasestorage.googleapis.com/v0/b/hairdu2024.appspot.com/o/oopsSmaller.png?alt=media&token=ba468149-e36c-4004-87c4-37cb949ec1ea'}}/> */}
    </>
  )
};

export default PlaceholderComponent;