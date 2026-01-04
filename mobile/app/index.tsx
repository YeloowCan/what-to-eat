import { Text, View } from "react-native";

export default function Index() {
  // 测试环境变量读取
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      {apiUrl && (
        <Text style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
          API URL: {apiUrl}
        </Text>
      )}
    </View>
  );
}
