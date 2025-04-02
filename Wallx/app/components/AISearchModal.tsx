import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { X, Sparkles } from "lucide-react-native";

interface AISearchModalProps {
  isVisible: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
}

const AISearchModal = ({
  isVisible,
  onClose,
  onGenerate,
}: AISearchModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      await onGenerate(prompt);
      setPrompt("");
      onClose();
    } catch (error) {
      console.error("Error generating wallpaper:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeywordPress = (keyword: string) => {
    setPrompt(keyword);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 h-2/3">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold dark:text-white">
              AI Wallpaper Generator
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            Enter a prompt to generate a unique AI wallpaper
          </Text>

          <TextInput
            className="h-12 bg-gray-100 dark:bg-gray-800 rounded-full px-4 mb-4 text-gray-800 dark:text-white"
            placeholder="Type your prompt here..."
            placeholderTextColor="#9ca3af"
            value={prompt}
            onChangeText={setPrompt}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text className="text-gray-600 dark:text-gray-400 mb-2">
            Suggested keywords:
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {[
              "Nature",
              "Abstract",
              "Minimal",
              "Space",
              "Neon",
              "Cyberpunk",
              "Geometric",
              "Gradient",
              "Dark",
              "Colorful",
            ].map((keyword) => (
              <TouchableOpacity
                key={keyword}
                className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1"
                onPress={() => handleKeywordPress(keyword)}
              >
                <Text className="text-sm dark:text-white">{keyword}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="bg-blue-500 h-12 rounded-full items-center justify-center"
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            style={{ opacity: prompt.trim() && !isGenerating ? 1 : 0.7 }}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View className="flex-row items-center">
                <Sparkles size={18} color="#ffffff" className="mr-2" />
                <Text className="text-white font-medium">
                  Generate Wallpaper
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AISearchModal;
