"use client"

import { Button } from "@/components/button"
import { Divider } from "@/components/divider"
import { Heading } from "@/components/heading"
import { Text } from "@/components/text"

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Heading level={1} className="text-gray-900">
        Welcome to ProductsApp
      </Heading>
      <Divider className="my-6" />
      <Text className="text-gray-800">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur.
      </Text>
      <Text className="mt-4 text-gray-800">
        ProductsApp offers a range of features to enhance your productivity and streamline your workflow. Explore the
        app to discover its full potential and how it can assist you in managing your projects and tasks more
        effectively.
      </Text>
      <Text className="mt-4 text-gray-800">
        Whether you are working solo or collaborating with a team, ProductsApp is designed to meet your needs and help
        you achieve your goals with ease. Start exploring today!
      </Text>
      <div className="mt-8">
        <Button href="/products" className="bg-gray-800 text-white">
          Explore Now
        </Button>
      </div>
    </main>
  )
}
