'use client'

import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Divider } from '@/components/divider'
import { Text } from '@/components/text'

export default function About() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Heading level={1} className="text-gray-900">About ProductsApp</Heading>
      <Divider className="my-4" />
      <Text className="text-gray-800">
        ProductsApp is a user-friendly platform designed to make your experience enjoyable. 
        Our mission is to provide a seamless and efficient way to manage your projects and tasks.
      </Text>
      <Text className="mt-4 text-gray-800">
        Here are some of the key features of ProductsApp:
      </Text>
      <ul className="list-disc ml-6 mt-2 text-gray-100">
        <li>Lorem Ipsum</li>
        <li>Lorem Ipsum</li>
        <li>Lorem Ipsum</li>
        <li>Lorem Ipsum</li>
      </ul>
      <Text className="mt-4 text-gray-800">
        We are continuously working on improving our platform and adding new features based on user feedback.
      </Text>
    </main>
  )
}
