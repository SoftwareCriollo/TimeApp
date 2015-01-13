require 'rails_helper'

RSpec.describe Api::TimelogsController, :type => :controller do

  describe 'POST #create' do

    let(:timelog){FactoryGirl.attributes_for(:timelog) }
    let(:valid_request){ post :create, timelog: timelog }
    let(:invalid_request) { post :create, timelog: {no_attr: "not"} }
    include_examples "resource", Timelog
  end
end