# frozen_string_literal: true

require "test_helper"

module Imdb
  module Test
    class TestEnum < Minitest::Test
      module ExampleEnum
        extend Framework::Types::Enum

        FOO = :bar
        BIZ = :baz

        finalize!
      end

      def test_defines_values
        assert_equal %i[bar baz], ExampleEnum.values
      end
    end
  end
end
