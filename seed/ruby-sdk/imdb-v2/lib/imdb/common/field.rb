# frozen_string_literal: true

module IMDB
  module Common
    class Field
      attr_accessor :name, :type, :required, :optional

      TYPE_MAPPING = {
        string: String,
        integer: Integer
      }

      def initialize(name:, type:, required: false, optional: true)
        @name = name
        @type = type
        @required = required
        @optional = optional
      end

      def validate_value!(val)
        validate_type!(val)
        validate_required!(val)

        true
      end

      private def validate_type!(val)
        if val.class != TYPE_MAPPING[type]
          raise IMDB::Common::Errors::FieldError
        end
      end

      private def validate_required!(val)
        if (val.nil? || val == "") && required
          raise IMDB::Common::Errors::FieldError
        end
      end
    end
  end
end
