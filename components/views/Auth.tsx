import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../../utils/supabase'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCodeBox, setShowCodeBox] = useState(false)
  const [code, setCode] = useState('')

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email
    })

    setLoading(false)

    if (error) {
      console.error('Error signing in:', error)
      Alert.alert(error.message)
    } else {
      setShowCodeBox(true)
    }
  }

  async function signInWithCode() {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      token: code,
      email: email,
      type: 'email'
    })

    setLoading(false)

    if (error) {
      console.error('Error signing in:', error)
      Alert.alert(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showCodeBox ? (
          <>
            <Text>Check your email</Text>
            <Text>We've sent a temporary login code to your inbox at {email}.</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setCode(text)}
              value={code}
              placeholder="000000"
              autoCapitalize="none"
              keyboardType="numeric"
            />
            <Button title="Continue with login code" disabled={loading} onPress={() => signInWithCode()} />
            <Button title="Back to login" onPress={() => setShowCodeBox(false)} />
          </>
        ) : (
          <>
            <Text style={styles.text}>Sign in with your email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: '100%',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
})