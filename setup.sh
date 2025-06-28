#!/bin/bash

# Medical Intake Summarizer - Setup Script
# This script helps set up and manage the project environment

echo "🏥 Medical Intake Summarizer Setup"
echo "=================================="

# Check if conda environment exists
if conda env list | grep -q "note_summarizer"; then
    echo "✅ Conda environment 'note_summarizer' already exists"
else
    echo "📦 Creating conda environment 'note_summarizer'..."
    conda create -n note_summarizer python=3.11 -y
fi

# Activate environment
echo "🔧 Activating conda environment..."
source $(conda info --base)/etc/profile.d/conda.sh
conda activate note_summarizer

# Install backend dependencies
echo "📚 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📚 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your OpenAI API key"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   Backend:  cd backend && python main.py"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "🔧 To activate environment in new terminals:"
echo "   conda activate note_summarizer" 