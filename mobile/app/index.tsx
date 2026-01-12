import { Text, View } from "react-native";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function Index() {
  // 应用路由守卫：未认证时自动重定向到登录页
  const isAuthenticated = useAuthGuard();

  // 如果未认证，useAuthGuard 会重定向，这里不会渲染
  if (!isAuthenticated) {
    return null;
  }

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
      <Text>欢迎使用 What-to-Eat</Text>
      {apiUrl && (
        <Text style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
          API URL: {apiUrl}
        </Text>
      )}
    </View>
  );
}
