# frozen_string_literal: true

require "test_helper"

class DummyResource < IMDB::Common::Resource
  field :title, type: :string, required: true
  field :synopsis, type: :string, optional: true
end

describe IMDB::Common::Resource do
  def setup
    @dummy = DummyResource.new(title: "Inception", synopsis: "Dreams inside dreams")
  end

  it "defines field definitions" do
    title_field = DummyResource.fields[:title]
    synopsis_field = DummyResource.fields[:synopsis]

    assert title_field.required
    assert synopsis_field.optional
  end

  it "defines attribute reader methods" do
    assert_equal "Inception", @dummy.title
    assert_equal "Dreams inside dreams", @dummy.synopsis
  end

  it "defines attribute writer methods" do
    @dummy.synopsis = "Is it all a dream?"

    assert_equal "Is it all a dream?", @dummy.synopsis
  end

  it "validates attribute types" do
    assert_raises IMDB::Common::Errors::FieldError do
      @dummy.title = 42
    end
  end

  it "validates required attributes" do
    assert_raises IMDB::Common::Errors::FieldError do
      @dummy.title = nil
    end
  end
end
