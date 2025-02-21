import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, Text } from 'react-native'
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
    } else {
      
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {showCodeBox ? (
          <>
            <Text>Enter the code you received in your email</Text>

            <TextInput
              onChangeText={(text) => setCode(text)}
              value={code}
              placeholder="000000"
              autoCapitalize="none"
              keyboardType="numeric"
            />
            <Button title="Continue with login code" disabled={loading} onPress={() => signInWithCode()} />
          </>
        ) : (
          <>
            <Text>Sign in with your email</Text>
            <TextInput
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
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})