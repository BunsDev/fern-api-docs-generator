# frozen_string_literal: true

require "test_helper"

module Imdb
  module Test
    class TestModel < Minitest::Test
      class ExampleModel < Framework::Types::Model
        field :name, String, required: true
        field :rating, Float
      end

      def test_field_definitions
        assert_equal 2, ExampleModel.fields.size

        name = ExampleModel.fields[:name]
        rating = ExampleModel.fields[:rating]

        assert_equal String, name.type
        assert name.required

        assert_equal Float, rating.type
        refute rating.required
      end

      def test_accessors
        example = ExampleModel.new(name: "Inception")

        assert_respond_to example, :name
        assert_respond_to example, :rating
      end

      def test_setters
        example = ExampleModel.new(name: "Inception")

        assert_respond_to example, :name=
        assert_respond_to example, :rating=
      end

      def test_initialization
        example = ExampleModel.new(name: "Inception", rating: 4.4)

        assert_equal "Inception", example.name
        assert_equal 4.4, example.rating
      end

      def test_extra_fields_on_initialization
        example = ExampleModel.new(foo: "bar")

        refute_respond_to example, :foo
        refute example.instance_variable_get(:@data).key?(:foo)
      end
    end
  end
end
