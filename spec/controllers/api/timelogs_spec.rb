require 'rails_helper'

RSpec.describe Api::TimelogsController, :type => :controller do

describe 'POST #create' do

  context 'Create new Timelog' do
    let(:timelog){FactoryGirl.attributes_for(:timelog) }
    it 'Answer to a json' do
      post :create, timelog: timelog
      expect(response.status).to eq(201)
    end

    it "Changes the Timelog count" do
      expect {create (:timelog) }.to change(Timelog, :count ).by(1)
    end
    end
end

end