# frozen_string_literal: true

require "test_helper"

module Imdb
  module Test
    class TestUnion < Minitest::Test
      class Square < Framework::Types::Model
        field :type, :square
        field :area, Float
      end

      class Circle < Framework::Types::Model
        field :type, :circle
        field :area, Float
      end

      module Shape
        extend Framework::Types::Union

        discriminator :type

        member Square, key: :square
        member Circle, key: :circle
      end

      module StringOrInteger
        extend Framework::Types::Union

        member String
        member Integer
      end

      def test_member_definitions
        assert_equal [[Square, :square], [Circle, :circle]], Shape.members
      end

      def test_resolve_type_discriminated_union
        assert_equal Square, Shape.resolve_type({ type: "square", area: 1.1 })
        assert_equal Circle, Shape.resolve_type({ type: "circle", area: 2.1 })
        assert_nil Shape.resolve_type({ foo: "bar" })
      end

      def test_resolve_type_undiscriminated_union
        assert_equal String, StringOrInteger.resolve_type("foobar")
        assert_equal Integer, StringOrInteger.resolve_type(1)
        assert_nil StringOrInteger.resolve_type(true)
      end
    end
  end
end
